import express from 'express';
import dotenv from 'dotenv';
import { apiRouter } from './routes.ts';

dotenv.config();

export const app = express();

// Parse JSON payloads (support larger payload for base64 screenshot inspection)
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Mount API router
app.use('/api', apiRouter);

// Fallback error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'An unexpected internal server error occurred.' });
});
