import { registerAs } from '@nestjs/config';

export default registerAs('typeorm', () => ({
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: Boolean(process.env.DB_SYNC),
  retryAttempts: process.env.DB_RETRY_ATTEMPTS,
}));
