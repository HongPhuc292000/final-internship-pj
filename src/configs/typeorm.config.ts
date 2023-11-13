import { registerAs } from '@nestjs/config';

export default registerAs('typeorm', () => ({
  type: process.env.DB_TYPE || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'helen020920',
  database: process.env.DB_NAME || 'final_internship_db',
  synchronize: Boolean(process.env.DB_SYNC) || false,
  retryAttempts: process.env.DB_RETRY_ATTEMPTS,
}));
