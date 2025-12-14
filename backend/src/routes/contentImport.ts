/**
 * Content Import Routes - Endpoints para importacao de conteudo M3U
 */

import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { importM3UContent, importM3UFromUrl, enrichContentWithTMDB } from '../services/contentImportService';

const router = Router();

// Configuracao do multer para upload de arquivos
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
      cb(new Error('Apenas arquivos .m3u, .m3u8 e .txt sao permitidos'));
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  }
});

/**
 * POST /api/content-import/file
 * Importa conteudo de arquivo M3U
 */
router.post('/file', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const filePath = req.file.path;
    const content = fs.readFileSync(filePath, 'utf-8');

    const contentType = req.body.contentType || 'all';
    const clearExisting = req.body.clearExisting === 'true';

    const result = await importM3UContent(content, {
      contentType: contentType as 'movie' | 'series' | 'all',
      clearExisting,
    });

    // Remover arquivo temporario
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: `Importacao concluida: ${result.inserted} inseridos, ${result.skipped} ignorados`,
      ...result
    });
  } catch (error: any) {
    console.error('Erro ao importar arquivo M3U:', error);
    res.status(500).json({ error: 'Falha ao importar arquivo M3U', details: error.message });
  }
});

/**
 * POST /api/content-import/url
 * Importa conteudo de URL M3U
 */
router.post('/url', async (req, res) => {
  try {
    const { url, contentType = 'all', clearExisting = false } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL e obrigatoria' });
    }

    const result = await importM3UFromUrl(url, {
      contentType: contentType as 'movie' | 'series' | 'all',
      clearExisting,
    });

    res.json({
      success: true,
      message: `Importacao concluida: ${result.inserted} inseridos, ${result.skipped} ignorados`,
      ...result
    });
  } catch (error: any) {
    console.error('Erro ao importar M3U de URL:', error);
    res.status(500).json({ error: 'Falha ao importar M3U de URL', details: error.message });
  }
});

/**
 * POST /api/content-import/enrich
 * Enriquece conteudo com dados do TMDB
 */
router.post('/enrich', async (req, res) => {
  try {
    const { tmdbApiKey, limit = 100 } = req.body;

    if (!tmdbApiKey) {
      return res.status(400).json({ error: 'tmdbApiKey e obrigatoria' });
    }

    const result = await enrichContentWithTMDB(tmdbApiKey, limit);

    res.json({
      success: true,
      message: `Enriquecimento concluido: ${result.enriched} atualizados`,
      ...result
    });
  } catch (error: any) {
    console.error('Erro ao enriquecer conteudo:', error);
    res.status(500).json({ error: 'Falha ao enriquecer conteudo', details: error.message });
  }
});

export default router;
