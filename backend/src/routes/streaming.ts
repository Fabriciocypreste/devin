/**
 * Streaming Routes - Rotas protegidas para streaming de conteudo
 * 
 * Todas as rotas de streaming requerem:
 * 1. Autenticacao (JWT valido)
 * 2. Assinatura ativa (subscription middleware)
 * 3. Assinatura de request (para seguranca adicional)
 */

import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { 
  authMiddleware, 
  subscriptionMiddleware, 
  generateRequestSignature,
  validateRequestSignature,
  AuthRequest 
} from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/streaming/url/:contentId
 * Retorna URL de streaming para conteudo
 * Requer autenticacao + assinatura valida
 */
router.get('/url/:contentId', authMiddleware, subscriptionMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { contentId } = req.params;
    const { episodeId } = req.query;
    const userId = req.userId!;

    // Buscar conteudo
    const content = await prisma.content.findUnique({
      where: { id: Number(contentId) }
    });

    if (!content) {
      return res.status(404).json({ error: 'Conteudo nao encontrado' });
    }

    let streamUrl = content.streamUrl;

    // Se for serie e tiver episodeId, buscar URL do episodio
    if (episodeId) {
      const episode = await prisma.episode.findUnique({
        where: { id: Number(episodeId) }
      });
      if (episode && episode.streamUrl) {
        streamUrl = episode.streamUrl;
      }
    }

    if (!streamUrl) {
      return res.status(404).json({ error: 'URL de streaming nao disponivel' });
    }

    // Gerar assinatura para o request
    const timestamp = Date.now();
    const signature = generateRequestSignature(userId, Number(contentId), timestamp);

    // Retornar URL com assinatura (valida por 5 minutos)
    res.json({
      streamUrl,
      signature,
      timestamp,
      expiresIn: 300000, // 5 minutos em ms
      contentId: Number(contentId),
      episodeId: episodeId ? Number(episodeId) : null
    });
  } catch (error) {
    console.error('Erro ao obter URL de streaming:', error);
    res.status(500).json({ error: 'Erro ao obter URL de streaming' });
  }
});

/**
 * POST /api/streaming/validate
 * Valida assinatura de request antes de iniciar playback
 * Camada adicional de seguranca
 */
router.post('/validate', authMiddleware, subscriptionMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { signature, contentId, timestamp } = req.body;
    const userId = req.userId!;

    if (!signature || !contentId || !timestamp) {
      return res.status(400).json({ error: 'Parametros incompletos' });
    }

    const isValid = validateRequestSignature(
      signature,
      userId,
      Number(contentId),
      Number(timestamp)
    );

    if (!isValid) {
      return res.status(403).json({ 
        error: 'Assinatura invalida ou expirada',
        code: 'INVALID_SIGNATURE'
      });
    }

    res.json({ valid: true });
  } catch (error) {
    console.error('Erro ao validar assinatura:', error);
    res.status(500).json({ error: 'Erro ao validar assinatura' });
  }
});

/**
 * GET /api/streaming/check-access
 * Verifica se usuario tem acesso ao conteudo
 * Usado pelo player antes de iniciar
 */
router.get('/check-access', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    // Admin sempre tem acesso
    if (req.user?.role === 'admin') {
      return res.json({
        hasAccess: true,
        reason: 'admin',
        subscription: {
          status: 'active',
          plan: 'admin',
          endDate: null
        }
      });
    }

    // Buscar assinatura
    const subscription = await prisma.subscription.findUnique({
      where: { userId }
    });

    if (!subscription) {
      return res.json({
        hasAccess: false,
        reason: 'no_subscription',
        subscription: null
      });
    }

    // Verificar se expirou
    const now = new Date();
    const isExpired = subscription.endDate && subscription.endDate < now;
    const isActive = subscription.status === 'active' || subscription.status === 'trial';

    if (isExpired || !isActive) {
      return res.json({
        hasAccess: false,
        reason: isExpired ? 'expired' : 'inactive',
        subscription: {
          status: subscription.status,
          plan: subscription.plan,
          endDate: subscription.endDate
        }
      });
    }

    res.json({
      hasAccess: true,
      reason: 'valid_subscription',
      subscription: {
        status: subscription.status,
        plan: subscription.plan,
        endDate: subscription.endDate
      }
    });
  } catch (error) {
    console.error('Erro ao verificar acesso:', error);
    res.status(500).json({ error: 'Erro ao verificar acesso' });
  }
});

/**
 * GET /api/streaming/next-episode/:contentId
 * Retorna proximo episodio para auto-play
 * Requer autenticacao + assinatura valida
 */
router.get('/next-episode/:contentId', authMiddleware, subscriptionMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { contentId } = req.params;
    const { currentSeason, currentEpisode } = req.query;

    if (!currentSeason || !currentEpisode) {
      return res.status(400).json({ error: 'Temporada e episodio atual sao obrigatorios' });
    }

    const seasonNum = Number(currentSeason);
    const episodeNum = Number(currentEpisode);

    // Buscar proximo episodio na mesma temporada
    let nextEpisode = await prisma.episode.findFirst({
      where: {
        contentId: Number(contentId),
        seasonNumber: seasonNum,
        episodeNumber: episodeNum + 1
      },
      include: {
        season: true
      }
    });

    // Se nao encontrou, buscar primeiro episodio da proxima temporada
    if (!nextEpisode) {
      nextEpisode = await prisma.episode.findFirst({
        where: {
          contentId: Number(contentId),
          seasonNumber: seasonNum + 1,
          episodeNumber: 1
        },
        include: {
          season: true
        }
      });
    }

    if (!nextEpisode) {
      return res.json({ 
        hasNext: false,
        message: 'Ultimo episodio da serie'
      });
    }

    // Gerar assinatura para o proximo episodio
    const timestamp = Date.now();
    const signature = generateRequestSignature(req.userId!, Number(contentId), timestamp);

    res.json({
      hasNext: true,
      episode: {
        id: nextEpisode.id,
        seasonNumber: nextEpisode.seasonNumber,
        episodeNumber: nextEpisode.episodeNumber,
        name: nextEpisode.name,
        overview: nextEpisode.overview,
        stillPath: nextEpisode.stillPath,
        runtime: nextEpisode.runtime,
        streamUrl: nextEpisode.streamUrl
      },
      signature,
      timestamp
    });
  } catch (error) {
    console.error('Erro ao buscar proximo episodio:', error);
    res.status(500).json({ error: 'Erro ao buscar proximo episodio' });
  }
});

export default router;
