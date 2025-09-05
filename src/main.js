import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import * as dotenv from 'dotenv';

dotenv.config();

function parseBoolean(v, def = false) {
  if (v === undefined) return def;
  return String(v).toLowerCase() === 'true';
}
function parseOrigins() {
  const raw = process.env.CORS_ORIGINS;
  if (!raw || raw.trim() === '' || raw === '*') return '*';
  return raw.split(',').map(s => s.trim()).filter(Boolean);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: parseOrigins(),
    credentials: parseBoolean(process.env.CORS_CREDENTIALS, false),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
  });

  const port = Number(process.env.PORT) || 8888;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}
bootstrap();
