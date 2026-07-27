import { useId, useState, type FormEvent } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { isValidEmail, subscribe } from '@/lib/newsletter';
import { home } from '@/content';

type Status = 'idle' | 'submitting' | 'success' | 'error';

interface NewsletterFormProps {
  className?: string;
}

const { newsletter: t } = home;

/**
 * Minimal underline input for mailing-list signup.
 * Submission is stubbed until Brevo is wired — see lib/newsletter.ts.
 */
export const NewsletterForm = ({ className }: NewsletterFormProps) => {
  const inputId = useId();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (status === 'submitting') return;

    if (!isValidEmail(email)) {
      setStatus('error');
      setMessage(t.invalid);
      return;
    }

    setStatus('submitting');
    try {
      await subscribe(email);
      setStatus('success');
      setMessage(t.success);
      setEmail('');
    } catch {
      setStatus('error');
      setMessage(t.error);
    }
  };

  const isDone = status === 'success';

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('w-full max-w-xs', className)}
      noValidate
    >
      <label
        htmlFor={inputId}
        className="block text-[length:var(--text-caption)] uppercase tracking-[--tracking-nav] text-foreground/60"
      >
        {t.label}
      </label>

      <div className="mt-[--space-xs] flex items-center gap-[--space-xs] border-b border-foreground/30 pb-1 transition-colors duration-fast focus-within:border-foreground/80">
        <input
          id={inputId}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={t.placeholder}
          value={email}
          disabled={isDone}
          aria-invalid={status === 'error'}
          aria-describedby={message ? `${inputId}-status` : undefined}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status !== 'idle') {
              setStatus('idle');
              setMessage('');
            }
          }}
          className="min-w-0 flex-1 bg-transparent text-[length:var(--text-body)] text-foreground placeholder:text-foreground/40 focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          aria-label={t.submit}
          disabled={status === 'submitting' || isDone}
          className="shrink-0 p-1 text-foreground/70 transition-colors duration-fast hover:text-foreground disabled:opacity-50"
        >
          {status === 'submitting' ? (
            <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight aria-hidden className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Reserved line so the layout does not shift when feedback appears. */}
      <p
        id={`${inputId}-status`}
        role="status"
        aria-live="polite"
        className={cn(
          'mt-[--space-2xs] min-h-[1.25em] text-[length:var(--text-caption)]',
          status === 'error' ? 'text-destructive' : 'text-foreground/60',
        )}
      >
        {message}
      </p>
    </form>
  );
};
