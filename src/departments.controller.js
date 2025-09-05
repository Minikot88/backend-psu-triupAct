import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Controller('departments')
export class DepartmentsController {
  constructor() { this.prisma = new PrismaService(); }

  @Get()
  async getDepartments() {
    const latest = await this.prisma.session.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { token: true },
    });

    if (!latest?.token) {
      return { success: false, error: 'no session token found — please login first' };
    }

    // ทำให้แน่ใจว่า header เป็น Bearer <token>
    const bare = latest.token.replace(/^Bearer\s+/i, '');
    const res = await fetch('https://triup.tsri.or.th/service/api/departments', {
      headers: { Authorization: `Bearer ${bare}` },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return { success: false, error: `departments fetch failed: ${res.status} ${res.statusText} ${text}` };
    }

    return res.json(); // บางที API อาจคืนเป็น array หรือ {data:[]}
  }
}
