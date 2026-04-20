import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/contact-schema';
import { createRateLimiter } from '@/lib/rate-limit';
import { sendContactEmail } from '@/lib/email';

const limiter = createRateLimiter({ max: 3, windowMs: 60 * 60 * 1000 });

export async function POST(req: Request): Promise<Response> {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!limiter.check(ip)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad_json' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  try {
    await sendContactEmail({
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'send_failed' }, { status: 502 });
  }
}
