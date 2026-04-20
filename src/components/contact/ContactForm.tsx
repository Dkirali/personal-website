'use client';
import { useState, type FormEvent } from 'react';
import { contactSchema } from '@/lib/contact-schema';

type Status = 'idle' | 'sending' | 'sent' | 'error';

interface ContactFormProps {
  variant?: 'pro' | 'dashboard';
}

export function ContactForm({ variant = 'pro' }: ContactFormProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setError(null);
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const data = {
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      message: String(form.get('message') ?? ''),
      hp: String(form.get('hp') ?? ''),
    };
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      setError('Please fill all fields correctly (message needs 10+ characters).');
      setStatus('error');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus('sent');
        formEl.reset();
      } else if (res.status === 429) {
        setStatus('error');
        setError('Too many submissions — please try again in an hour.');
      } else {
        setStatus('error');
        setError(`Send failed (${res.status}).`);
      }
    } catch {
      setStatus('error');
      setError('Network error — please try again.');
    }
  }

  const inputCls =
    variant === 'pro'
      ? 'w-full p-2 border border-neutral-300 rounded text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]'
      : 'w-full p-2 bg-[#1b2838] border border-[#2a475e] rounded text-sm text-white placeholder:text-[#8f98a0] focus:outline-none focus:ring-2 focus:ring-[#66c0f4]';
  const btnCls =
    variant === 'pro'
      ? 'inline-flex items-center gap-2 px-4 py-2 bg-[#0a66c2] hover:bg-[#084a8f] text-white rounded text-sm font-medium disabled:opacity-60 transition-colors'
      : 'inline-flex items-center gap-2 px-4 py-2 bg-[#5c7e10] hover:bg-[#6fa71a] text-white rounded text-sm font-medium disabled:opacity-60 transition-colors';
  const mutedCls = variant === 'pro' ? 'text-neutral-500' : 'text-[#8f98a0]';

  return (
    <form onSubmit={onSubmit} className="space-y-3 max-w-md" noValidate>
      <input
        name="hp"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, opacity: 0 }}
      />
      <label className="block">
        <span className={`text-xs uppercase tracking-wide ${mutedCls}`}>Name</span>
        <input name="name" required maxLength={100} placeholder="Your name" className={`${inputCls} mt-1`} />
      </label>
      <label className="block">
        <span className={`text-xs uppercase tracking-wide ${mutedCls}`}>Email</span>
        <input
          name="email"
          type="email"
          required
          maxLength={200}
          placeholder="you@example.com"
          className={`${inputCls} mt-1`}
        />
      </label>
      <label className="block">
        <span className={`text-xs uppercase tracking-wide ${mutedCls}`}>Message</span>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          placeholder="Tell me about the role or project…"
          className={`${inputCls} mt-1`}
        />
      </label>
      <button type="submit" disabled={status === 'sending'} className={btnCls}>
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>
      {status === 'sent' && (
        <p className="text-sm text-green-600" role="status">
          Thanks — I&apos;ll be in touch.
        </p>
      )}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
