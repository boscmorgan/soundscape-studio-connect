/**
 * Design-system entry point.
 *
 * The site is an application, not a published component library, so it has no
 * `main`/`exports` of its own. This file is that missing surface: it names the
 * components that make up the design system and is the entry the design-sync
 * converter bundles into `window.Lorenzo1UP`.
 *
 * Scope is deliberate — primitives plus brand elements. Page-specific
 * compositions (Testimonials, BrandMarquee, HeroImage, NewsletterForm,
 * SiteNav, ContactDialog) read straight from `@/content` and `@/config/site`
 * rather than taking props, so they are not reusable as design-system parts.
 *
 * Compound parts (Dialog*, Carousel*) are exported so previews can compose
 * them; only the roots are registered as components in `componentSrcMap`.
 */

export { Button } from '../src/components/ui/button';
export { Input } from '../src/components/ui/input';
export { Textarea } from '../src/components/ui/textarea';

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '../src/components/ui/dialog';

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '../src/components/ui/carousel';

export { Wordmark } from '../src/components/Wordmark';
export { SocialLinks } from '../src/components/SocialLinks';
