/**
 * Access Codes Routes - Rotas para gerenciamento de codigos de acesso temporario (trial)
 * 
 * Funcionalidades:
 * - Gerar codigo de acesso (1 hora de duracao)
 * - Validar codigo de acesso
 * - Listar codigos (admin)
 * - Revogar codigo (admin)
 */

import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth';
import crypto from 'crypto';

const router = Router();
const prisma = new PrismaClient();

// Gerar codigo aleatorio de 8 caracteres
function generateCode(): string {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

/**
 * POST /api/access-codes/generate
 * Gera um novo codigo de acesso temporario (1 hora)
 * Apenas admin pode gerar
 */
router.post('/generate', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { email, durationMinutes = 60 } = req.body;
    const adminId = req.userId!;

    // Gerar codigo unico
    let code = generateCode();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await prisma.accessCode.findUnique({ where: { code } });
      if (!existing) break;
      code = generateCode();
      attempts++;
    }

    // Calcular expiracao (padrao 1 hora)
    const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000);

    const accessCode = await prisma.accessCode.create({
      data: {
        code,
        email: email || null,
        expiresAt,
        status: 'active',
        createdBy: adminId
      }
    });

    res.json({
      success: true,
      accessCode: {
        id: accessCode.id,
        code: accessCode.code,
        email: accessCode.email,
        expiresAt: accessCode.expiresAt,
        status: accessCode.status,
        durationMinutes
      }
    });
  } catch (error) {
    console.error('Erro ao gerar codigo de acesso:', error);
    res.status(500).json({ error: 'Erro ao gerar codigo de acesso' });
  }
});

/**
 * POST /api/access-codes/validate
 * Valida um codigo de acesso e retorna se esta ativo
 */
router.post('/validate', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Codigo nao fornecido' });
    }

    const accessCode = await prisma.accessCode.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!accessCode) {
      return res.status(404).json({ valid: false, error: 'Codigo nao encontrado' });
    }

    // Verificar se expirou
    const now = new Date();
    if (accessCode.expiresAt < now) {
      // Atualizar status para expirado
      await prisma.accessCode.update({
        where: { id: accessCode.id },
        data: { status: 'expired' }
      });
      return res.json({ valid: false, error: 'Codigo expirado', expiredAt: accessCode.expiresAt });
    }

    // Verificar status
    if (accessCode.status !== 'active') {
      return res.json({ valid: false, error: `Codigo ${accessCode.status}` });
    }

    // Codigo valido - calcular tempo restante
    const remainingMs = accessCode.expiresAt.getTime() - now.getTime();
    const remainingMinutes = Math.floor(remainingMs / 60000);

    res.json({
      valid: true,
      expiresAt: accessCode.expiresAt,
      remainingMinutes,
      email: accessCode.email
    });
  } catch (error) {
    console.error('Erro ao validar codigo:', error);
    res.status(500).json({ error: 'Erro ao validar codigo' });
  }
});

/**
 * POST /api/access-codes/use
 * Marca um codigo como usado e vincula ao usuario
 */
router.post('/use', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { code } = req.body;
    const userId = req.userId!;

    if (!code) {
      return res.status(400).json({ error: 'Codigo nao fornecido' });
    }

    const accessCode = await prisma.accessCode.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!accessCode) {
      return res.status(404).json({ error: 'Codigo nao encontrado' });
    }

    // Verificar se expirou
    const now = new Date();
    if (accessCode.expiresAt < now) {
      await prisma.accessCode.update({
        where: { id: accessCode.id },
        data: { status: 'expired' }
      });
      return res.status(400).json({ error: 'Codigo expirado' });
    }

    // Verificar se ja foi usado
    if (accessCode.status === 'used') {
      return res.status(400).json({ error: 'Codigo ja foi utilizado' });
    }

    // Marcar como usado
    const updated = await prisma.accessCode.update({
      where: { id: accessCode.id },
      data: {
        status: 'used',
        userId,
        usedAt: now
      }
    });

    // Criar/atualizar assinatura temporaria do usuario
    await prisma.subscription.upsert({
      where: { userId },
      update: {
        status: 'trial',
        endDate: accessCode.expiresAt,
        plan: 'trial'
      },
      create: {
        userId,
        status: 'trial',
        plan: 'trial',
        endDate: accessCode.expiresAt,
        price: 0
      }
    });

    res.json({
      success: true,
      message: 'Codigo ativado com sucesso',
      expiresAt: accessCode.expiresAt
    });
  } catch (error) {
    console.error('Erro ao usar codigo:', error);
    res.status(500).json({ error: 'Erro ao usar codigo' });
  }
});

/**
 * GET /api/access-codes
 * Lista todos os codigos de acesso (admin)
 */
router.get('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Atualizar codigos expirados
    await prisma.accessCode.updateMany({
      where: {
        status: 'active',
        expiresAt: { lt: new Date() }
      },
      data: { status: 'expired' }
    });

    const where = status ? { status: String(status) } : {};

    const [codes, total] = await Promise.all([
      prisma.accessCode.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.accessCode.count({ where })
    ]);

    res.json({
      codes,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Erro ao listar codigos:', error);
    res.status(500).json({ error: 'Erro ao listar codigos' });
  }
});

/**
 * DELETE /api/access-codes/:id
 * Revoga um codigo de acesso (admin)
 */
router.delete('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.accessCode.update({
      where: { id: Number(id) },
      data: { status: 'revoked' }
    });

    res.json({ success: true, message: 'Codigo revogado' });
  } catch (error) {
    console.error('Erro ao revogar codigo:', error);
    res.status(500).json({ error: 'Erro ao revogar codigo' });
  }
});

/**
 * GET /api/access-codes/stats
 * Estatisticas dos codigos (admin)
 */
router.get('/stats', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    // Atualizar codigos expirados primeiro
    await prisma.accessCode.updateMany({
      where: {
        status: 'active',
        expiresAt: { lt: new Date() }
      },
      data: { status: 'expired' }
    });

    const [active, used, expired, total] = await Promise.all([
      prisma.accessCode.count({ where: { status: 'active' } }),
      prisma.accessCode.count({ where: { status: 'used' } }),
      prisma.accessCode.count({ where: { status: 'expired' } }),
      prisma.accessCode.count()
    ]);

    res.json({
      active,
      used,
      expired,
      total
    });
  } catch (error) {
    console.error('Erro ao obter estatisticas:', error);
    res.status(500).json({ error: 'Erro ao obter estatisticas' });
  }
});

export default router;
