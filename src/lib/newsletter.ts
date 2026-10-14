/**
 * Newsletter subscription, through Brevo's hosted form.
 *
 * The page keeps its own minimal input (see NewsletterForm) and sends the
 * address to the endpoint Brevo's embed code posts to, so no API key ever
 * reaches the browser. The form itself (list, double opt-in, confirmation
 * email) is configured in Brevo, not here.
 *
 * Brevo answers `?isAjax=1` posts with JSON (`{ success: true }` on success).
 * If the browser cannot read the reply (a CORS refusal, say), the address is
 * sent again as a plain form post, which Brevo accepts the same way; a second
 * submission of the same address is harmless.
 */

import { newsletterFormUrl } from '@/config/site';

export class NewsletterError extends Error {
  constructor(message = 'Newsletter signup failed.') {
    super(message);
    this.name = 'NewsletterError';
  }
}

/** Pragmatic email check — the provider performs real validation. */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

/** The fields Brevo's own form sends. `email_address_check` is its honeypot. */
export function brevoFormData(email: string): FormData {
  const data = new FormData();
  data.append('EMAIL', email.trim());
  data.append('email_address_check', '');
  data.append('locale', 'it');
  data.append('html_type', 'simple');
  return data;
}

export async function subscribe(email: string): Promise<void> {
  let response: Response;
  try {
    response = await fetch(`${newsletterFormUrl}?isAjax=1`, {
      method: 'POST',
      body: brevoFormData(email),
    });
  } catch {
    // The reply could not be read (CORS or network). Post as a plain form;
    // the response is opaque, so a network failure here is the only error.
    await fetch(newsletterFormUrl, {
      method: 'POST',
      mode: 'no-cors',
      body: brevoFormData(email),
    });
    return;
  }

  if (!response.ok) throw new NewsletterError(`Brevo replied ${response.status}.`);
  const reply = (await response.json().catch(() => null)) as { success?: boolean } | null;
  if (reply && reply.success === false) throw new NewsletterError();
}
