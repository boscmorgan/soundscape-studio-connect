import { useState } from 'react';
import { Link } from 'react-router-dom';

import { BrandMarquee } from '@/components/BrandMarquee';
import { ContactDialog } from '@/components/ContactDialog';
import { SiteNav } from '@/components/SiteNav';
import { SocialLinks } from '@/components/SocialLinks';
import { Testimonials } from '@/components/Testimonials';
import { Wordmark } from '@/components/Wordmark';
import { useSeo } from '@/hooks/useSeo';
import { site } from '@/config/site';
import { bio } from '@/content';

/**
 * Bio: the one scrolling page. Biography, collaborations strip, reviews.
 */
const Bio = () => {
  const [contactOpen, setContactOpen] = useState(false);

  useSeo({
    title: bio.seoTitle,
    description: bio.seoDescription,
    path: '/bio',
  });

  return (
    <>
      <div className="min-h-screen-safe bg-background px-[--edge-x] py-[--edge-y]">
        <header className="mb-[--space-2xl]">
          <SiteNav onContact={() => setContactOpen(true)} />
        </header>

        <main className="mx-auto w-full max-w-5xl">
          <Link to="/" aria-label={bio.back} className="block">
            <Wordmark className="mx-auto [--wordmark-size:clamp(1.75rem,5vw,3.15rem)]" />
          </Link>

          <section className="mt-[--space-2xl]">
            <h1 className="text-[length:var(--text-heading)] font-bold tracking-[--tracking-tight]">
              {bio.title}
            </h1>
            <div className="mt-[--space-lg] max-w-[--measure] space-y-[--space-md] text-[length:var(--text-lead)] leading-[--leading-body] text-foreground/85">
              {bio.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className="mt-[--space-2xl]">
            <h2 className="text-[length:var(--text-caption)] uppercase tracking-[--tracking-nav] text-foreground/50">
              {bio.brandsTitle}
            </h2>
            <BrandMarquee className="mt-[--space-lg]" />
          </section>

          <section className="mt-[--space-2xl]">
            <h2 className="text-[length:var(--text-caption)] uppercase tracking-[--tracking-nav] text-foreground/50">
              {bio.testimonialsTitle}
            </h2>
            <Testimonials className="mt-[--space-lg]" />
          </section>
        </main>

        <footer className="mt-[--space-2xl] flex flex-col items-center gap-[--space-md] pb-[--space-lg] text-center">
          <SocialLinks />
          <address className="not-italic text-[length:var(--text-caption)] leading-[--leading-body] text-foreground/60">
            <p className="font-bold text-foreground/85">{bio.identity}</p>
            <p>
              <a href={`mailto:${site.artistEmail}`} className="underline underline-offset-4 hover:text-foreground">
                {site.artistEmail}
              </a>
            </p>
            <p className="text-foreground/50">{bio.artistEmailNote}</p>
          </address>
        </footer>
      </div>

      <ContactDialog open={contactOpen} onOpenChange={setContactOpen} />
    </>
  );
};

export default Bio;
