import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import * as dotenv from 'dotenv';
import { PrismaService } from './prisma.service.js';
import bodyParser from 'body-parser';

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

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use(bodyParser.json());
  expressApp.use(bodyParser.urlencoded({ extended: true }));

  expressApp.get('/', (_req, res) => {
    res.json({ ok: true, service: 'backend-psu', time: new Date().toISOString() });
  });

  const prisma = new PrismaService();
  expressApp.post('/auth/login', async (req, res) => {
    try {
      const { email, username, password } = req.body || {};
      const loginEmail = (email || username || '').trim();
      const pass = (password || '').trim();

      if (!loginEmail || !pass) {
        return res.status(400).json({ success: false, error: 'email/username and password required' });
      }

      const form = new FormData();
      form.append('email', loginEmail);
      form.append('password', pass);

      const r = await fetch('https://triup.tsri.or.th/service/api/login', {
        method: 'POST',
        body: form,
      });

      if (!r.ok) {
        const text = await r.text().catch(() => '');
        return res.status(401).json({
          success: false,
          error: `login failed: ${r.status} ${r.statusText} ${text}`,
        });
      }

      const data = await r.json().catch(() => ({}));
      const token = data?.access_token;
      const tokenType = (data?.token_type || 'bearer').toLowerCase();

      if (!token) {
        return res.status(500).json({
          success: false,
          error: `token not found in response: ${JSON.stringify(data).slice(0,200)}`,
        });
      }

      const session = await prisma.session.create({
        data: {
          username: loginEmail,
          token: tokenType === 'bearer' ? token : `${tokenType} ${token}`,
        },
        select: { id: true, username: true, createdAt: true },
      });

      return res.json({ success: true, session });
    } catch (e) {
      console.error('Login error:', e);
      return res.status(500).json({ success: false, error: 'internal error' });
    }
  });

  const port = Number(process.env.PORT) || 8888;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}
bootstrap();
