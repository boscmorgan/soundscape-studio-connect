/**
 * All user-facing copy. The site is Italian-only — there is no runtime
 * language switch, so copy is imported directly rather than keyed by locale.
 */

import { site } from '@/config/site';

export const nav = {
  bio: 'Bio',
  music: 'Music',
  contact: 'Contact',
} as const;

export const home = {
  imageAlt: `${site.legalName} ritratto`,
  newsletter: {
    label: 'Iscriviti alla newsletter',
    placeholder: 'La tua email',
    submit: 'Iscriviti',
    success: 'Iscrizione ricevuta. Grazie!',
    invalid: 'Inserisci un indirizzo email valido.',
    error: 'Qualcosa è andato storto. Riprova.',
  },
} as const;

export const bio = {
  seoTitle: `Bio — ${site.name}`,
  seoDescription:
    'Lorenzo Lucchetti, in arte lorenzo1UP: produttore, ingegnere del suono e DJ. Diplomato in Sassofono al Conservatorio di Brescia e alla pointblank Music School di Londra.',
  title: 'Bio',
  paragraphs: [
    'Lorenzo Lucchetti (in arte lorenzo1UP) si diploma in Sassofono al Conservatorio di Brescia nel 2015. Consegue il Music Production Diploma alla pointblank Music School di Londra nel 2017 ed inizia la sua carriera artistica come produttore, ingegnere del suono e DJ.',
    'Pubblica quindi i primi lavori recensiti da testate inglesi ed americane importanti e collabora con artisti di tutto il mondo, organizzando anche tour in Europa, Sudamerica e Giappone.',
    'Dopo dieci anni di permanenza in Inghilterra, ritorna in Italia ed inizia ad insegnare Produzione, Sound Design, Missaggio, Mastering e Music Business al Conservatorio di Brescia.',
    'Attualmente è impegnato in un processo di riforma sonora, mischiando musica elettronica di matrice internazionale (future beats, uk garage, drum&bass) e cantato pop sia in italiano che in inglese per creare uno stile completamente nuovo. Il debutto è previsto per la fine del 2027.',
  ],
  brandsTitle: 'Collaborazioni',
  testimonialsTitle: 'Recensioni',
  back: 'Indietro',
} as const;

export const contact = {
  title: 'Contatti',
  email: 'La tua email',
  subject: 'Oggetto',
  message: 'Messaggio',
  send: 'Invia',
  defaultSubject: 'Richiesta di contatto',
} as const;

export const notFound = {
  title: '404',
  message: 'Pagina non trovata',
  cta: 'Torna alla home',
} as const;

export interface Brand {
  name: string;
  logo?: string;
}

export const brands: readonly Brand[] = [
  { name: 'Soho House', logo: '/brand_logos/soho_house.png' },
  { name: 'Native Instruments', logo: '/brand_logos/native_instruments.png' },
  { name: 'Nike', logo: '/brand_logos/nike.png' },
  { name: 'The Greater Goods Co.' },
  { name: 'Liverpool Sound City' },
  { name: 'Ace Hotel' },
  { name: 'Arts Council of England', logo: '/brand_logos/arts_council.png' },
  { name: 'RedBull', logo: '/brand_logos/redbull.png' },
  { name: 'Hard Rock', logo: '/brand_logos/hard_rock.png' },
  { name: 'VICE', logo: '/brand_logos/vice.png' },
  { name: 'The Hoxton', logo: '/brand_logos/hoxton.svg.png' },
  { name: 'Pirate Studios', logo: '/brand_logos/pirate_studios.png' },
  { name: 'Molto Music Group' },
  { name: 'pointblank Music School', logo: '/brand_logos/pointblank.png' },
] as const;

export interface Testimonial {
  name: string;
  quote: string;
  image: string;
}

export const testimonials: readonly Testimonial[] = [
  {
    name: 'Brenda & Maria Manuela (Bogotá, Colombia)',
    quote:
      'Lorenzo è davvero un\'anima bellissima. È creativo, autentico, e si sente quanto si dedichi a ogni progetto. La sua musica ha profondità, onestà e tanto cuore. È gratificante lavorare con persone come lui: persone che sanno farti sentire al centro, che sono generose con la loro energia e che ti ricordano perché facciamo tutto questo.',
    image: '/testimonials/brenda.webp',
  },
  {
    name: 'DijahSB (Toronto, Canada)',
    quote:
      'Lorenzo è un professionista, ti dà tutto ciò di cui hai bisogno nei tempi giusti, è molto gentile e nel complesso un ingegnere del suono e produttore straordinario. È estremamente affidabile e vale l\'investimento per ottenere il meglio dal tuo lavoro.',
    image: '/testimonials/dijah.webp',
  },
  {
    name: 'DJ Caio Santos (San Paolo, Brasile)',
    quote:
      'Ciao a tutti, sono Caio Santos, dj brasiliano: lavorare con Lorenzo è incredibile. È molto didattico e dedito alla musica, ogni volta che abbiamo lavorato insieme ho imparato moltissimo. In sintesi, affido la mia musica alle sue mani con grande fiducia.',
    image: '/testimonials/caiosantos.webp',
  },
  {
    name: 'Obeka (Manchester, Inghilterra)',
    quote:
      'Il mio EP è stato curato in modo eccellente: elementi percussivi e dal vivo mixati e colorati così bene da portare le dinamiche sonore a un livello completamente nuovo.',
    image: '/testimonials/obeka.webp',
  },
  {
    name: 'Palmaria (Lerici, Italia)',
    quote:
      'Abbiamo lavorato con lorenzo1UP in molti ruoli: come remixer, come artista collaboratore e come tecnico di mix e mastering. Non potremmo consigliarlo di più! Le sue competenze musicali e tecniche e soprattutto il suo amore e la sua passione per la musica e per il raggiungimento di grandi risultati sono semplicemente impareggiabili.',
    image: '/testimonials/palmaria.webp',
  },
  {
    name: 'Pekodjinn (Ginevra, Svizzera)',
    quote:
      'Un mio amico ha lavorato con Lorenzo per il suo EP e ho adorato il mix e il mastering. Ho voluto provare anche per il mio EP ed è andata benissimo. Il processo è stato rapido e pulito. Ha ascoltato con attenzione i miei feedback e ha risposto con precisione. Consigliatissimo!',
    image: '/testimonials/pekodjinn.webp',
  },
  {
    name: 'Taite Imogen (Londra, Inghilterra)',
    quote:
      'Lavorare con lorenzo1UP in questi ultimi cinque anni è stata un\'esperienza straordinaria e stimolante. La sua dedizione al mestiere e alla creatività è contagiosa e sa tirare fuori il meglio da te, spingendoti come artista. Ho sempre la libertà di provare cose nuove e sperimentare senza giudizio, e il suo talento e la sua conoscenza ti permettono di farlo al massimo livello. È un privilegio lavorare con un produttore e artista così capace, che comprende il mio linguaggio creativo e mi aiuta a costruire il mio mondo con l\'entusiasmo di chi lo sente proprio.',
    image: '/testimonials/imogen.webp',
  },
  {
    name: 'The Last Skeptik (Los Angeles, California)',
    quote:
      'Adoro lavorare con Lorenzo, sia come session musician sia come produttore e ingegnere del suono. Fa suonare tutto in modo maledettamente fantastico, ogni singola volta!',
    image: '/testimonials/skeptik.webp',
  },
] as const;
