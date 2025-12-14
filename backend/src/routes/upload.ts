import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import * as channelService from '../services/channelService';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.m3u' || ext === '.m3u8' || ext === '.txt') {
      cb(null, true);
    } else {
      cb(new Error('Only .m3u, .m3u8, and .txt files are allowed'));
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024
  }
});

router.post('/m3u', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const content = fs.readFileSync(filePath, 'utf-8');

    const clearExisting = req.body.clearExisting === 'true';
    if (clearExisting) {
      await channelService.deleteAllCategories();
    }

    const result = await channelService.importM3U(content);

    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: `Imported ${result.channels} channels in ${result.categories} categories`,
      ...result
    });
  } catch (error) {
    console.error('Error uploading M3U:', error);
    res.status(500).json({ error: 'Failed to import M3U file' });
  }
});

router.post('/json', async (req: Request, res: Response) => {
  try {
    const { channels, clearExisting } = req.body;

    if (!channels || !Array.isArray(channels)) {
      return res.status(400).json({ error: 'channels array is required' });
    }

    if (clearExisting) {
      await channelService.deleteAllCategories();
    }

    const result = await channelService.importJSON(channels);

    res.json({
      success: true,
      message: `Imported ${result.channels} channels in ${result.categories} categories`,
      ...result
    });
  } catch (error) {
    console.error('Error importing JSON:', error);
    res.status(500).json({ error: 'Failed to import JSON' });
  }
});

router.post('/m3u/url', async (req: Request, res: Response) => {
  try {
    const { url, clearExisting } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const response = await fetch(url);
    if (!response.ok) {
      return res.status(400).json({ error: 'Failed to fetch M3U from URL' });
    }

    const content = await response.text();

    if (clearExisting) {
      await channelService.deleteAllCategories();
    }

    const result = await channelService.importM3U(content);

    res.json({
      success: true,
      message: `Imported ${result.channels} channels in ${result.categories} categories`,
      ...result
    });
  } catch (error) {
    console.error('Error importing M3U from URL:', error);
    res.status(500).json({ error: 'Failed to import M3U from URL' });
  }
});

export default router;
