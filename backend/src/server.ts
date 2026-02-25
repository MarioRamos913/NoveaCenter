import app from './app';
import dotenv from 'dotenv';
import { pool } from './config/database';


dotenv.config();

const PORT = process.env.PORT || 4000;

// Test DB Connection
pool.query('SELECT NOW()', async (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully at:', res.rows[0].now);


    app.listen(PORT, () => {
      console.log(`NovaCenter Backend running on port ${PORT}`);
    });
  }
});
