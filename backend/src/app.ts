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
app.use('/api', licenseRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('NovaCenter API is running');
});

export default app;
