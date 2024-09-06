import { defineConfig } from 'drizzle-kit';
import { ConfigService } from '@nestjs/config';
import 'dotenv/config';

const configService = new ConfigService();

export default defineConfig({
  schema: './src/database/database-schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: configService.get<string>('POSTGRES_HOST', 'localhost'),
    port: configService.get<number>('POSTGRES_PORT', 5432),
    user: configService.get<string>('POSTGRES_USER', 'defaultUser'),
    password: configService.get<string>('POSTGRES_PASSWORD', 'defaultPassword'),
    database: configService.get<string>('POSTGRES_DB', 'defaultDatabase'),
    ssl: false,
  },
});
