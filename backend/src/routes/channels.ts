import { Router, Request, Response } from 'express';
import * as channelService from '../services/channelService';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
    const includeInactive = req.query.includeInactive === 'true';
    const channels = await channelService.getAllChannels(categoryId, includeInactive);
    res.json(channels);
  } catch (error) {
    console.error('Error fetching channels:', error);
    res.status(500).json({ error: 'Failed to fetch channels' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const channel = await channelService.getChannelById(id);
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }
    res.json(channel);
  } catch (error) {
    console.error('Error fetching channel:', error);
    res.status(500).json({ error: 'Failed to fetch channel' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, logo, url, format, active, order, categoryId } = req.body;
    const channel = await channelService.updateChannel(id, { name, logo, url, format, active, order, categoryId });
    res.json(channel);
  } catch (error) {
    console.error('Error updating channel:', error);
    res.status(500).json({ error: 'Failed to update channel' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await channelService.deleteChannel(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting channel:', error);
    res.status(500).json({ error: 'Failed to delete channel' });
  }
});

router.delete('/', async (req: Request, res: Response) => {
  try {
    await channelService.deleteAllChannels();
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting all channels:', error);
    res.status(500).json({ error: 'Failed to delete all channels' });
  }
});

export default router;
