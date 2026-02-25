import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Routes
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import roleRoutes from './modules/roles/role.routes';
import resourceRoutes from './modules/resources/resource.routes';
import menuRoutes from './modules/menu/menu.routes';
import licenseRoutes from './routes/licenseRoutes';

// Middlewares
import { authenticate } from './middlewares/auth.middleware';
import { authorize } from './middlewares/role.middleware';

dotenv.config();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes — Solo admin
app.use('/api/users', authenticate, authorize(['admin']), userRoutes);
app.use('/api/roles', authenticate, authorize(['admin']), roleRoutes);
app.use('/api/resources', authenticate, authorize(['admin']), resourceRoutes);

// Protected routes — Cualquier usuario autenticado
app.use('/api/menu', authenticate, menuRoutes);
app.use('/api/licenses', licenseRoutes);

// Health Check
app.get('/', (_req, res) => {
  res.send('NovaCenter API is running');
});

export default app;
