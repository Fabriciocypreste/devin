import { Router } from 'express';
import prisma from '../services/database';

const router = Router();

// POST /api/progress - Salva ou atualiza progresso
router.post('/', async (req, res) => {
  try {
    const { userId, contentId, episodeId, watchedTime, duration } = req.body;

    if (!userId || !contentId || watchedTime === undefined || duration === undefined) {
      return res.status(400).json({ error: 'Missing required fields: userId, contentId, watchedTime, duration' });
    }

    // Buscar informacoes do episodio se for serie
    let seasonNumber: number | null = null;
    let episodeNumber: number | null = null;

    if (episodeId) {
      const episode = await prisma.episode.findUnique({
        where: { id: episodeId }
      });
      if (episode) {
        seasonNumber = episode.seasonNumber;
        episodeNumber = episode.episodeNumber;
      }
    }

    // Verificar se ja existe um registro para este usuario/conteudo/episodio
    // IMPORTANTE: Para filmes (sem episodeId), usamos episodeId = 0 em vez de NULL
    // Isso resolve o bug SQL onde NULL != NULL, permitindo a constraint unique funcionar
    const episodeIdValue = episodeId ? parseInt(episodeId) : 0;
    
    const existingProgress = await prisma.viewHistory.findFirst({
      where: {
        userId: parseInt(userId),
        contentId: parseInt(contentId),
        episodeId: episodeIdValue === 0 ? null : episodeIdValue
      }
    });

    // Calcular se o conteudo foi completado (assistiu mais de 90%)
    const completed = duration > 0 && (watchedTime / duration) >= 0.9;

    let progress;
    if (existingProgress) {
      // Atualizar registro existente
      progress = await prisma.viewHistory.update({
        where: { id: existingProgress.id },
        data: {
          watchedTime: parseInt(watchedTime),
          duration: parseInt(duration),
          seasonNumber,
          episodeNumber,
          completed
        }
      });
    } else {
      // Criar novo registro
      // Para filmes (sem episodeId), usamos null mas verificamos duplicatas manualmente acima
      progress = await prisma.viewHistory.create({
        data: {
          userId: parseInt(userId),
          contentId: parseInt(contentId),
          episodeId: episodeIdValue === 0 ? null : episodeIdValue,
          seasonNumber,
          episodeNumber,
          watchedTime: parseInt(watchedTime),
          duration: parseInt(duration),
          completed
        }
      });
    }

    res.json(progress);
  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

// GET /api/progress/:contentId - Retorna progresso do filme ou ultimo episodio assistido da serie
// OTIMIZADO: Nao carrega todas as temporadas/episodios, apenas o necessario
router.get('/:contentId', async (req, res) => {
  try {
    const { contentId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'Missing required query parameter: userId' });
    }

    // Buscar o conteudo SEM carregar todas as temporadas/episodios (performance)
    const content = await prisma.content.findUnique({
      where: { id: parseInt(contentId) },
      select: {
        id: true,
        title: true,
        type: true,
        posterPath: true,
        backdropPath: true,
        streamUrl: true,
        runtime: true
      }
    });

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Buscar o progresso mais recente do usuario para este conteudo
    const progress = await prisma.viewHistory.findFirst({
      where: {
        userId: parseInt(userId as string),
        contentId: parseInt(contentId)
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        episode: true,
        content: true
      }
    });

    if (!progress) {
      // Nenhum progresso encontrado
      return res.json({
        hasProgress: false,
        content,
        type: content.type
      });
    }

    // Calcular porcentagem assistida
    const percentWatched = progress.duration > 0 
      ? Math.round((progress.watchedTime / progress.duration) * 100) 
      : 0;

    // Formatar tempo assistido
    const watchedMinutes = Math.floor(progress.watchedTime / 60);
    const totalMinutes = Math.floor(progress.duration / 60);

    res.json({
      hasProgress: true,
      progress: {
        id: progress.id,
        watchedTime: progress.watchedTime,
        duration: progress.duration,
        completed: progress.completed,
        percentWatched,
        watchedMinutes,
        totalMinutes,
        episodeId: progress.episodeId,
        seasonNumber: progress.seasonNumber,
        episodeNumber: progress.episodeNumber,
        updatedAt: progress.updatedAt
      },
      episode: progress.episode,
      content,
      type: content.type,
      // Mensagem formatada para exibicao
      displayMessage: content.type === 'movie'
        ? `Voce assistiu ${watchedMinutes} minutos de ${totalMinutes} minutos`
        : progress.seasonNumber && progress.episodeNumber
          ? `Voce esta no episodio ${progress.episodeNumber} da temporada ${progress.seasonNumber}`
          : null
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// GET /api/progress/:contentId/next - Retorna proximo episodio automaticamente
router.get('/:contentId/next', async (req, res) => {
  try {
    const { contentId } = req.params;
    const { userId, currentEpisodeId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'Missing required query parameter: userId' });
    }

    // Buscar o conteudo com todas as temporadas e episodios
    const content = await prisma.content.findUnique({
      where: { id: parseInt(contentId) },
      include: {
        seasons: {
          include: {
            episodes: {
              orderBy: [
                { seasonNumber: 'asc' },
                { episodeNumber: 'asc' }
              ]
            }
          },
          orderBy: { seasonNumber: 'asc' }
        }
      }
    });

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Se nao for serie, nao tem proximo episodio
    if (content.type !== 'series') {
      return res.json({
        hasNextEpisode: false,
        message: 'Content is not a series'
      });
    }

    // Criar lista plana de todos os episodios ordenados
    const allEpisodes: Array<{
      id: number;
      seasonNumber: number;
      episodeNumber: number;
      name: string | null;
      streamUrl: string | null;
      runtime: number | null;
      stillPath: string | null;
    }> = [];

    for (const season of content.seasons) {
      for (const episode of season.episodes) {
        allEpisodes.push({
          id: episode.id,
          seasonNumber: episode.seasonNumber,
          episodeNumber: episode.episodeNumber,
          name: episode.name,
          streamUrl: episode.streamUrl,
          runtime: episode.runtime,
          stillPath: episode.stillPath
        });
      }
    }

    // Ordenar por temporada e episodio
    allEpisodes.sort((a, b) => {
      if (a.seasonNumber !== b.seasonNumber) {
        return a.seasonNumber - b.seasonNumber;
      }
      return a.episodeNumber - b.episodeNumber;
    });

    let currentEpisodeIndex = -1;

    if (currentEpisodeId) {
      // Encontrar o episodio atual na lista
      currentEpisodeIndex = allEpisodes.findIndex(ep => ep.id === parseInt(currentEpisodeId as string));
    } else {
      // Buscar o ultimo episodio assistido pelo usuario
      const lastProgress = await prisma.viewHistory.findFirst({
        where: {
          userId: parseInt(userId as string),
          contentId: parseInt(contentId),
          episodeId: { not: null }
        },
        orderBy: { updatedAt: 'desc' }
      });

      if (lastProgress && lastProgress.episodeId) {
        currentEpisodeIndex = allEpisodes.findIndex(ep => ep.id === lastProgress.episodeId);
      }
    }

    // Se nao encontrou episodio atual, retornar o primeiro
    if (currentEpisodeIndex === -1) {
      if (allEpisodes.length > 0) {
        return res.json({
          hasNextEpisode: true,
          nextEpisode: allEpisodes[0],
          isFirstEpisode: true,
          message: 'Starting from first episode'
        });
      }
      return res.json({
        hasNextEpisode: false,
        message: 'No episodes found'
      });
    }

    // Verificar se existe proximo episodio
    const nextEpisodeIndex = currentEpisodeIndex + 1;

    if (nextEpisodeIndex >= allEpisodes.length) {
      // Nao ha mais episodios - serie concluida
      // Marcar serie como concluida para o usuario
      await prisma.viewHistory.updateMany({
        where: {
          userId: parseInt(userId as string),
          contentId: parseInt(contentId)
        },
        data: { completed: true }
      });

      return res.json({
        hasNextEpisode: false,
        seriesCompleted: true,
        message: 'Serie concluida! Voce assistiu todos os episodios.'
      });
    }

    const nextEpisode = allEpisodes[nextEpisodeIndex];
    const currentEpisode = allEpisodes[currentEpisodeIndex];

    // Verificar se mudou de temporada
    const isNewSeason = nextEpisode.seasonNumber !== currentEpisode.seasonNumber;

    res.json({
      hasNextEpisode: true,
      nextEpisode,
      currentEpisode,
      isNewSeason,
      message: isNewSeason
        ? `Proximo: Temporada ${nextEpisode.seasonNumber}, Episodio ${nextEpisode.episodeNumber}`
        : `Proximo: Episodio ${nextEpisode.episodeNumber}`
    });
  } catch (error) {
    console.error('Error fetching next episode:', error);
    res.status(500).json({ error: 'Failed to fetch next episode' });
  }
});

// GET /api/progress/continue-watching - Lista de conteudos para "Continuar Assistindo"
router.get('/user/:userId/continue-watching', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = '20' } = req.query;

    // Buscar todos os progressos nao completados do usuario
    const progressList = await prisma.viewHistory.findMany({
      where: {
        userId: parseInt(userId),
        completed: false,
        watchedTime: { gt: 0 }
      },
      include: {
        content: true,
        episode: true
      },
      orderBy: { updatedAt: 'desc' },
      take: parseInt(limit as string)
    });

    // Agrupar por conteudo (para series, pegar apenas o ultimo episodio)
    const contentMap = new Map<number, typeof progressList[0]>();
    
    for (const progress of progressList) {
      const existing = contentMap.get(progress.contentId);
      if (!existing || progress.updatedAt > existing.updatedAt) {
        contentMap.set(progress.contentId, progress);
      }
    }

    const continueWatching = Array.from(contentMap.values()).map(progress => {
      const percentWatched = progress.duration > 0 
        ? Math.round((progress.watchedTime / progress.duration) * 100) 
        : 0;
      const watchedMinutes = Math.floor(progress.watchedTime / 60);
      const totalMinutes = Math.floor(progress.duration / 60);

      return {
        id: progress.id,
        content: progress.content,
        episode: progress.episode,
        watchedTime: progress.watchedTime,
        duration: progress.duration,
        percentWatched,
        watchedMinutes,
        totalMinutes,
        seasonNumber: progress.seasonNumber,
        episodeNumber: progress.episodeNumber,
        updatedAt: progress.updatedAt,
        displayMessage: progress.content.type === 'movie'
          ? `${watchedMinutes} min de ${totalMinutes} min`
          : progress.seasonNumber && progress.episodeNumber
            ? `T${progress.seasonNumber}:E${progress.episodeNumber}`
            : null
      };
    });

    res.json({
      continueWatching,
      total: continueWatching.length
    });
  } catch (error) {
    console.error('Error fetching continue watching:', error);
    res.status(500).json({ error: 'Failed to fetch continue watching list' });
  }
});

export default router;
