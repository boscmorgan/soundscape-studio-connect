/**
 * Newsletter subscription seam.
 *
 * ── NOT YET WIRED TO BREVO ──────────────────────────────────────────────
 * The UI is complete; only this function needs implementing. Subscribing
 * requires a Brevo API key, which must NOT ship in client-side bundles
 * (anything in `import.meta.env` is readable by every visitor). So the real
 * implementation needs one of:
 *
 *   a) A serverless function (e.g. /api/subscribe) holding BREVO_API_KEY,
 *      which this function POSTs to. Recommended.
 *   b) Brevo's own hosted form endpoint, which is safe to call from the
 *      browser — swap this for a plain <form action=…> POST.
 *
 * Reference: POST https://api.brevo.com/v3/contacts
 *   headers: { 'api-key': <server-side key>, 'content-type': 'application/json' }
 *   body:    { email, listIds: [<listId>], updateEnabled: true }
 * ────────────────────────────────────────────────────────────────────────
 */

export class NewsletterNotConfiguredError extends Error {
  constructor() {
    super('Newsletter provider is not configured yet.');
    this.name = 'NewsletterNotConfiguredError';
  }
}

/** Pragmatic email check — the provider performs real validation. */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export async function subscribe(email: string): Promise<void> {
  // TODO(brevo): replace with a call to the subscribe endpoint described above.
  void email;
  throw new NewsletterNotConfiguredError();
}
