import { Router } from 'express';
import prisma from '../services/database';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { type, featured, active, search, page = '1', limit = '20' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const where: any = {};
    if (type) where.type = type;
    if (featured !== undefined) where.featured = featured === 'true';
    if (active !== undefined) where.active = active === 'true';
    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { originalTitle: { contains: search as string } }
      ];
    }

    const [contents, total] = await Promise.all([
      prisma.content.findMany({
        where,
        include: {
          _count: { select: { viewHistory: true, favorites: true } },
          seasons: { include: { _count: { select: { episodes: true } } } }
        },
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.content.count({ where })
    ]);

    res.json({ contents, total, page: parseInt(page as string), limit: parseInt(limit as string) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const content = await prisma.content.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        seasons: {
          include: { episodes: { orderBy: { episodeNumber: 'asc' } } },
          orderBy: { seasonNumber: 'asc' }
        },
        _count: { select: { viewHistory: true, favorites: true } }
      }
    });
    if (!content) return res.status(404).json({ error: 'Content not found' });
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

router.post('/', async (req, res) => {
  try {
    const content = await prisma.content.create({ data: req.body });
    res.status(201).json(content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create content' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const content = await prisma.content.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update content' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.content.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete content' });
  }
});

router.post('/:id/seasons', async (req, res) => {
  try {
    const season = await prisma.season.create({
      data: { ...req.body, contentId: parseInt(req.params.id) }
    });
    res.status(201).json(season);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create season' });
  }
});

router.post('/seasons/:seasonId/episodes', async (req, res) => {
  try {
    const episode = await prisma.episode.create({
      data: { ...req.body, seasonId: parseInt(req.params.seasonId) }
    });
    res.status(201).json(episode);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create episode' });
  }
});

export default router;
