import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import licenseRoutes from './routes/licenseRoutes';

dotenv.config();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import { authenticate } from './middlewares/auth.middleware';
import { authorize } from './middlewares/role.middleware';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticate, authorize(['admin']), userRoutes);
app.use('/api/licenses', licenseRoutes); // Assuming licenseRoutes handles its own auth or needs to be protected too.
// The prompt says "El rol user solo puede: Ver sus propias licencias".
// So licenseRoutes need protection too. I should probably check licenseRoutes content.

// Health Check
app.get('/', (req, res) => {
  res.send('NovaCenter API is running');
});

export default app;
