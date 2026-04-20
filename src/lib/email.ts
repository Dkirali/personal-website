import { Resend } from 'resend';

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export async function sendContactEmail(input: ContactPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY not configured');

  const to = process.env.CONTACT_TO_EMAIL ?? 'kiralidoruk@gmail.com';
  const from = process.env.CONTACT_FROM_EMAIL ?? 'onboarding@resend.dev';

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: input.email,
    subject: `[Site] ${input.name}`,
    text: `From: ${input.name} <${input.email}>\n\n${input.message}`,
  });
  if (error) throw new Error(`Resend error: ${error.message}`);
}
