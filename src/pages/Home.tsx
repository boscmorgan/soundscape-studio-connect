import { useState } from 'react';

import { HeroImage } from '@/components/HeroImage';
import { NewsletterForm } from '@/components/NewsletterForm';
import { SiteNav } from '@/components/SiteNav';
import { SocialLinks } from '@/components/SocialLinks';
import { Wordmark } from '@/components/Wordmark';
import { ContactDialog } from '@/components/ContactDialog';
import { useSeo } from '@/hooks/useSeo';
import { site } from '@/config/site';
import { home } from '@/content';

/**
 * One-pager: full-bleed portrait, centred outlined wordmark, nav above and
 * newsletter + socials below. Fixed to the viewport — nothing scrolls.
 */
const Home = () => {
  const [contactOpen, setContactOpen] = useState(false);

  useSeo({
    title: `${site.name} — ${site.legalName}`,
    description:
      'lorenzo1UP — produttore, ingegnere del suono e DJ. Musica elettronica e cantato pop tra future beats, uk garage e drum&bass.',
    path: '/',
  });

  return (
    <>
      <div className="relative h-screen-safe w-full overflow-hidden">
        <HeroImage alt={home.imageAlt} />

        <div className="relative z-10 grid h-full grid-rows-[auto_1fr_auto] px-[--edge-x] py-[--edge-y]">
          <header>
            <SiteNav onContact={() => setContactOpen(true)} />
          </header>

          <main className="flex items-center justify-center">
            <Wordmark
              as="h1"
              className="translate-y-[var(--wordmark-offset-y)]"
            />
          </main>

          <footer className="flex flex-col items-center gap-[--space-md] sm:flex-row sm:items-end sm:justify-between">
            <NewsletterForm className="sm:max-w-xs" />
            <SocialLinks className="-mr-2" />
          </footer>
        </div>
      </div>

      <ContactDialog open={contactOpen} onOpenChange={setContactOpen} />
    </>
  );
};

export default Home;
