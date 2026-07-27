import { Link } from 'react-router-dom';

import { Wordmark } from '@/components/Wordmark';
import { notFound } from '@/content';

const NotFound = () => (
  <div className="flex h-screen-safe flex-col items-center justify-center gap-[--space-md] bg-background px-[--edge-x] text-center">
    <Wordmark className="[--wordmark-width:clamp(10rem,30vw,18rem)]" />
    <p className="text-[length:var(--text-heading)] font-bold tracking-[--tracking-tight]">
      {notFound.title}
    </p>
    <p className="text-[length:var(--text-body)] text-foreground/70">
      {notFound.message}
    </p>
    <Link
      to="/"
      className="mt-[--space-xs] text-[length:var(--text-nav)] uppercase tracking-[--tracking-nav] text-foreground/80 underline-offset-8 transition-colors duration-fast hover:text-foreground hover:underline"
    >
      {notFound.cta}
    </Link>
  </div>
);

export default NotFound;
