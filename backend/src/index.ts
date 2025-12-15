import express from 'express';
import cors from 'cors';
import path from 'path';

import categoriesRouter from './routes/categories';
import channelsRouter from './routes/channels';
import uploadRouter from './routes/upload';
import settingsRouter from './routes/settings';
import usersRouter from './routes/users';
import contentRouter from './routes/content';
import analyticsRouter from './routes/analytics';
import siteconfigRouter from './routes/siteconfig';
import bannersRouter from './routes/banners';
import progressRouter from './routes/progress';
import contentImportRouter from './routes/contentImport';
import authRouter from './routes/auth';
import accessCodesRouter from './routes/accessCodes';
import streamingRouter from './routes/streaming';
import subscribersRouter from './routes/subscribers';

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/categories', categoriesRouter);
app.use('/api/channels', channelsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/users', usersRouter);
app.use('/api/content', contentRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/siteconfig', siteconfigRouter);
app.use('/api/banners', bannersRouter);
app.use('/api/progress', progressRouter);
app.use('/api/content-import', contentImportRouter);
app.use('/api/auth', authRouter);
app.use('/api/access-codes', accessCodesRouter);
app.use('/api/streaming', streamingRouter);
app.use('/api/subscribers', subscribersRouter);

app.get('/api', (req, res) => {
  res.json({
    name: 'RedFlix API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      categories: {
        list: 'GET /api/categories',
        get: 'GET /api/categories/:id',
        update: 'PUT /api/categories/:id',
        delete: 'DELETE /api/categories/:id',
        deleteAll: 'DELETE /api/categories'
      },
      channels: {
        list: 'GET /api/channels',
        get: 'GET /api/channels/:id',
        update: 'PUT /api/channels/:id',
        delete: 'DELETE /api/channels/:id',
        deleteAll: 'DELETE /api/channels'
      },
      upload: {
        m3uFile: 'POST /api/upload/m3u',
        m3uUrl: 'POST /api/upload/m3u/url'
      },
      settings: {
        list: 'GET /api/settings',
        get: 'GET /api/settings/:key',
        set: 'PUT /api/settings/:key'
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                    RedFlix API Server                      ║
╠═══════════════════════════════════════════════════════════╣
║  Server running on: http://localhost:${PORT}                 ║
║  API Documentation: http://localhost:${PORT}/api             ║
║  Health Check:      http://localhost:${PORT}/api/health      ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
