import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { requestId } from './middleware/request-id';
import { errorHandler } from './middleware/error-handler';
import { rateLimit } from './middleware/rate-limit.middleware';
import { logger } from './utils/logger';
import routes from './routes';

const app = express();

// 1. Request ID
app.use(requestId);

// 2. Security headers
app.use(helmet());

// 3. CORS
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production'
      ? ['https://phygital-trace.xyz', 'https://www.phygital-trace.xyz']
      : ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  })
);

// 4. Rate limiting
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000, keyPrefix: 'rl:global' }));

// 5. Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 6. Request logging
app.use(pinoHttp({ logger }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 7. Routes (under /v1 prefix)
app.use('/v1', routes);

// 8. 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Route not found' },
  });
});

// 9. Global error handler (MUST be last)
app.use(errorHandler);

export default app;
