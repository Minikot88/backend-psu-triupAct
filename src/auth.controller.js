import { Controller, Post } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Controller('auth')
export class AuthController {
  constructor() { this.prisma = new PrismaService(); }

  @Post('login')
  async login(...args) {
    const req = args[0];
    const { email, username, password } = (req && req.body) || {};
    const loginEmail = (email || username || '').trim();
    const pass = (password || '').trim();

    if (!loginEmail || !pass) {
      return { success: false, error: 'email/username and password required' };
    }

    const form = new FormData();
    form.append('email', loginEmail);
    form.append('password', pass);

    const res = await fetch('https://triup.tsri.or.th/service/api/login', {
      method: 'POST',
      body: form, // อย่าตั้ง Content-Type เอง
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return { success: false, error: `login failed: ${res.status} ${res.statusText} ${text}` };
    }

    const data = await res.json().catch(() => ({}));
    // ตามเอกสาร: { access_token, token_type, user: {...} }
    const token = data?.access_token;
    const tokenType = (data?.token_type || 'bearer').toLowerCase();

    if (!token) {
      return { success: false, error: `token not found in response: ${JSON.stringify(data).slice(0,200)}` };
    }

    // เก็บลงตาราง Session
    const session = await this.prisma.session.create({
      data: {
        username: loginEmail,
        token: tokenType === 'bearer' ? token : `${tokenType} ${token}`,
      },
      select: { id: true, username: true, createdAt: true },
    });

    return { success: true, session };
  }
}