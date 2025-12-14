import { Router, Request, Response } from 'express';
import * as channelService from '../services/channelService';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const settings = await channelService.getAllSettings();
    const settingsObj: Record<string, string> = {};
    settings.forEach(s => {
      settingsObj[s.key] = s.value;
    });
    res.json(settingsObj);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

router.get('/:key', async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const value = await channelService.getSetting(key);
    if (value === null) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    res.json({ key, value });
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({ error: 'Failed to fetch setting' });
  }
});

router.put('/:key', async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    if (value === undefined) {
      return res.status(400).json({ error: 'Value is required' });
    }
    const setting = await channelService.setSetting(key, value);
    res.json(setting);
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({ error: 'Failed to update setting' });
  }
});

export default router;
