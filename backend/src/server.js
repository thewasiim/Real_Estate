import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler.js';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import propertyRoutes from './routes/properties.routes.js';
import projectRoutes from './routes/projects.routes.js';
import agentRoutes from './routes/agents.routes.js';
import leadRoutes from './routes/leads.routes.js';
import favoriteRoutes from './routes/favorites.routes.js';
import userRoutes from './routes/users.routes.js';
import uploadRoutes from './routes/uploads.routes.js';

const app = express();
const PORT = process.env.PORT || 4000;

// ──────────────────────────────────────
// Security & parsing middleware
// ──────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));

// Rate limiting for auth & lead endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' },
});

const leadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many submissions, please try again later.' },
});

// ──────────────────────────────────────
// Root & Health checks
// ──────────────────────────────────────
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'OK',
    message: 'F.B. Developer Backend is running 🚀',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    },
  });
});

// ──────────────────────────────────────
// API Routes
// ──────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/leads', leadLimiter, leadRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/users', userRoutes);
app.use('/api/uploads', uploadRoutes);

// ──────────────────────────────────────
// 404 for unmatched API routes
// ──────────────────────────────────────
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, error: 'Not found' });
});

// ──────────────────────────────────────
// Global error handler (must be last)
// ──────────────────────────────────────
app.use(errorHandler);

// ──────────────────────────────────────
// Start Server with Database Connection
// ──────────────────────────────────────
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`✓ Server Running on port ${PORT}`);
  });
}

startServer();

export default app;
