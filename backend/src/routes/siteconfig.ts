import { Router } from 'express';
import prisma from '../services/database';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const where = category ? { category: category as string } : {};
    const configs = await prisma.siteConfig.findMany({ where, orderBy: { key: 'asc' } });
    res.json(configs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch site config' });
  }
});

router.get('/:key', async (req, res) => {
  try {
    const config = await prisma.siteConfig.findUnique({ where: { key: req.params.key } });
    if (!config) return res.status(404).json({ error: 'Config not found' });
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch config' });
  }
});

router.put('/:key', async (req, res) => {
  try {
    const { value, type, category, description } = req.body;
    const config = await prisma.siteConfig.upsert({
      where: { key: req.params.key },
      update: { value, type, category, description },
      create: { key: req.params.key, value, type, category, description }
    });
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update config' });
  }
});

router.post('/bulk', async (req, res) => {
  try {
    const { configs } = req.body;
    const results = await Promise.all(
      configs.map((c: any) =>
        prisma.siteConfig.upsert({
          where: { key: c.key },
          update: { value: c.value, type: c.type, category: c.category },
          create: c
        })
      )
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update configs' });
  }
});

router.delete('/:key', async (req, res) => {
  try {
    await prisma.siteConfig.delete({ where: { key: req.params.key } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete config' });
  }
});

router.get('/defaults/init', async (req, res) => {
  try {
    const defaults = [
      { key: 'site_name', value: 'RedFlix', type: 'text', category: 'general' },
      { key: 'site_logo', value: '/logo.png', type: 'image', category: 'branding' },
      { key: 'primary_color', value: '#E50914', type: 'color', category: 'theme' },
      { key: 'secondary_color', value: '#141414', type: 'color', category: 'theme' },
      { key: 'background_color', value: '#000000', type: 'color', category: 'theme' },
      { key: 'text_color', value: '#FFFFFF', type: 'color', category: 'theme' },
      { key: 'hero_title', value: 'Bem-vindo ao RedFlix', type: 'text', category: 'content' },
      { key: 'hero_subtitle', value: 'Assista filmes e séries ilimitados', type: 'text', category: 'content' },
      { key: 'footer_text', value: '© 2024 RedFlix. Todos os direitos reservados.', type: 'text', category: 'content' }
    ];

    for (const config of defaults) {
      await prisma.siteConfig.upsert({
        where: { key: config.key },
        update: {},
        create: config
      });
    }

    res.json({ success: true, message: 'Default configs initialized' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to initialize defaults' });
  }
});

export default router;
