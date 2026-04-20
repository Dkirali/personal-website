import { describe, expect, it } from 'vitest';
import { contactSchema } from '@/lib/contact-schema';

describe('contactSchema', () => {
  const valid = { name: 'Ada', email: 'a@b.com', message: 'hi there friend', hp: '' };

  it('accepts valid input', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects bad email', () => {
    expect(contactSchema.safeParse({ ...valid, email: 'not-an-email' }).success).toBe(false);
  });

  it('rejects short message', () => {
    expect(contactSchema.safeParse({ ...valid, message: 'hi' }).success).toBe(false);
  });

  it('rejects filled honeypot', () => {
    expect(contactSchema.safeParse({ ...valid, hp: 'bot' }).success).toBe(false);
  });

  it('rejects empty name', () => {
    expect(contactSchema.safeParse({ ...valid, name: '' }).success).toBe(false);
  });

  it('rejects oversize message', () => {
    expect(contactSchema.safeParse({ ...valid, message: 'a'.repeat(2001) }).success).toBe(false);
  });
});
