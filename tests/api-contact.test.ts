import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('@/lib/email', () => ({ sendContactEmail: vi.fn() }));

import { POST } from '@/app/api/contact/route';
import { sendContactEmail } from '@/lib/email';

function req(body: unknown, ip = '1.2.3.4'): Request {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  });
}

describe('POST /api/contact', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 400 on invalid input', async () => {
    const res = await POST(req({ name: '', email: 'x', message: '', hp: '' }, '10.0.0.1'));
    expect(res.status).toBe(400);
  });

  it('returns 400 on honeypot', async () => {
    const res = await POST(
      req({ name: 'A', email: 'a@b.com', message: 'hi hi hi hi hi', hp: 'bot' }, '10.0.0.2'),
    );
    expect(res.status).toBe(400);
  });

  it('returns 400 on malformed JSON', async () => {
    const bad = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': '10.0.0.3' },
      body: '{not json',
    });
    const res = await POST(bad);
    expect(res.status).toBe(400);
  });

  it('returns 200 and sends email on valid input', async () => {
    const res = await POST(
      req({ name: 'A', email: 'a@b.com', message: 'hello there', hp: '' }, '10.0.0.4'),
    );
    expect(res.status).toBe(200);
    expect(sendContactEmail).toHaveBeenCalledOnce();
  });

  it('returns 502 when email send fails', async () => {
    vi.mocked(sendContactEmail).mockRejectedValueOnce(new Error('boom'));
    const res = await POST(
      req({ name: 'A', email: 'a@b.com', message: 'hello there', hp: '' }, '10.0.0.5'),
    );
    expect(res.status).toBe(502);
  });

  it('rate-limits after 3 per IP', async () => {
    const ok = { name: 'A', email: 'a@b.com', message: 'hello there', hp: '' };
    const r1 = await POST(req(ok, '9.9.9.9'));
    const r2 = await POST(req(ok, '9.9.9.9'));
    const r3 = await POST(req(ok, '9.9.9.9'));
    const blocked = await POST(req(ok, '9.9.9.9'));
    expect(r1.status).toBe(200);
    expect(r2.status).toBe(200);
    expect(r3.status).toBe(200);
    expect(blocked.status).toBe(429);
  });
});
