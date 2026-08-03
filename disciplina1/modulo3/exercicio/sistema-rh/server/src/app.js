import express from 'express';
import { testDatabaseConnection } from './db/pool.js';
import { readRoutes } from './routes/readRoutes.js';
import { vectorRoutes } from './routes/vectorRoutes.js';
import { writeRoutes } from './routes/writeRoutes.js';

export function createApp() {
  const app = express();

  app.use((_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (_req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }

    next();
  });

  app.use(express.json());
  app.use(readRoutes);
  app.use(writeRoutes);
  app.use(vectorRoutes);

  app.get('/health', async (_req, res, next) => {
    try {
      await testDatabaseConnection();
      res.status(200).json({ ok: true });
    } catch (error) {
      next(error);
    }
  });

  app.use((err, _req, res, _next) => {
    console.error(err);

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      res.status(400).json({
        error: 'invalid_json',
        message: 'Request body must be valid JSON.'
      });
      return;
    }

    if (err?.code === '42P01') {
      res.status(503).json({
        error: 'database_not_initialized',
        message: 'Database tables are missing. Run initialization scripts before using the API.'
      });
      return;
    }

    res.status(500).json({
      error: 'internal_server_error',
      message: 'Unexpected server error.'
    });
  });

  return app;
}
