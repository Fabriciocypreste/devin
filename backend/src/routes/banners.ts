import { Router } from 'express';
import prisma from '../services/database';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { position, active } = req.query;
    const where: any = {};
    if (position) where.position = position;
    if (active !== undefined) where.active = active === 'true';
    
    const banners = await prisma.banner.findMany({
      where,
      orderBy: { order: 'asc' }
    });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const banner = await prisma.banner.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!banner) return res.status(404).json({ error: 'Banner not found' });
    res.json(banner);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch banner' });
  }
});

router.post('/', async (req, res) => {
  try {
    const banner = await prisma.banner.create({ data: req.body });
    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create banner' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const banner = await prisma.banner.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(banner);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update banner' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.banner.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete banner' });
  }
});

export default router;
