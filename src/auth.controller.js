import { Controller, Post } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Controller('auth') // กำหนด path หลักเป็น /auth
export class AuthController {
  // สร้าง instance ของ PrismaService ไว้ใช้งานกับ DB
  constructor() { this.prisma = new PrismaService(); }

  @Post('login') // รับ HTTP POST ที่ path /auth/login
  async login(...args) {
    // ดึง request object ออกมา (NestJS ปกติควรใช้ @Req แต่ที่นี่ใช้ args[0])
    const req = args[0];

    // อ่าน email, username, password จาก body
    const { email, username, password } = (req && req.body) || {};
    // เลือกใช้ email หรือ username แล้ว trim ช่องว่าง
    const loginEmail = (email || username || '').trim();
    // trim password เช่นกัน
    const pass = (password || '').trim();

    // ถ้าไม่มี email/username หรือ password → ส่ง error กลับ
    if (!loginEmail || !pass) {
      return { success: false, error: 'email/username and password required' };
    }

    // เตรียม form-data ส่งไปยัง API ภายนอก (TSRI)
    const form = new FormData();
    form.append('email', loginEmail);
    form.append('password', pass);

    // ยิง fetch ไปที่ endpoint login ของ TSRI
    const res = await fetch('https://triup.tsri.or.th/service/api/login', {
      method: 'POST',
      body: form,
    });

    // ถ้า status code ไม่ใช่ 200 → ถือว่าล้มเหลว
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return { success: false, error: `login failed: ${res.status} ${res.statusText} ${text}` };
    }

    // parse JSON ที่ได้กลับมา
    const data = await res.json().catch(() => ({}));
    // ดึง access_token ออกมา
    const token = data?.access_token;
    // ตรวจชนิด token เช่น bearer
    const tokenType = (data?.token_type || 'bearer').toLowerCase();

    // ถ้าไม่มี token ใน response → แจ้ง error
    if (!token) {
      return { success: false, error: `token not found in response: ${JSON.stringify(data).slice(0,200)}` };
    }

    // บันทึก session ลงฐานข้อมูล (ใช้ Prisma)
    const session = await this.prisma.session.create({
      data: {
        username: loginEmail, // เก็บ email/username
        // ถ้า token type เป็น bearer → เก็บเฉพาะ token
        // ถ้าไม่ใช่ → เก็บแบบ "type token"
        token: tokenType === 'bearer' ? token : `${tokenType} ${token}`,
      },
      // เลือก field ที่จะ return
      select: { id: true, username: true, createdAt: true },
    });

    // ส่งผลลัพธ์กลับ: success และ session ที่สร้าง
    return { success: true, session };
  }
}