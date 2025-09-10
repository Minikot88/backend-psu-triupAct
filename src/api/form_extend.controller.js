import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Controller('api/form_extend')
export class Form_extendController {
  // สร้าง instance ของ PrismaService เพื่อใช้ติดต่อ DB
  constructor() { 
    this.prisma = new PrismaService(); 
  }

  // กำหนด endpoint: GET /form_extend
  @Get()
  async getForm_extend() {
    // 1. ดึง session ล่าสุดจาก DB (เลือก token อย่างเดียว)
    const latest = await this.prisma.session.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { token: true },
    });

    // 2. ถ้าไม่มี token -> ให้ return error กลับไป
    if (!latest?.token) {
      return { success: false, error: 'no session token found — please login first' };
    }

    // 3. ตัด prefix "Bearer " ออก (ถ้ามี) เพื่อให้ได้ค่า token แบบ raw
    const bare = latest.token.replace(/^Bearer\s+/i, '');

    // 4. ส่ง request ไปยัง API ภายนอก (TSRI API) พร้อมใส่ Authorization header
    const res = await fetch('https://triup.tsri.or.th/service/api/form_extend', {
      headers: { Authorization: `Bearer ${bare}` },
    });

    // 5. ถ้า API ตอบกลับไม่สำเร็จ (เช่น 401/500) -> ส่ง error กลับ
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return { 
        success: false, 
        error: `form_extend fetch failed: ${res.status} ${res.statusText} ${text}` 
      };
    }

    // 6. ถ้าสำเร็จ -> ส่งผลลัพธ์ JSON กลับไปยัง client
    return res.json();
  }
}