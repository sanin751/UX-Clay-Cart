import { toast } from 'react-toastify';
import Badge from '../components/ui/Badge';

const ARTICLES = [
  {
    title: 'The Art of the Wood-Fired Kiln',
    excerpt:
      'Inside the studio during a 12-hour wood firing, and why the unpredictability of the flame is exactly the point.',
    category: 'Craft',
    date: 'June 2, 2026',
    image: '/images/studio-8.jpg',
  },
  {
    title: 'Caring for Your Handmade Ceramics',
    excerpt: 'A simple guide to hand-washing, storing, and living with pieces that were never meant to be perfect.',
    category: 'Care Guide',
    date: 'May 18, 2026',
    image: '/images/studio-5.jpg',
  },
  {
    title: 'Meet the Artisans: A Morning in the Studio',
    excerpt: 'We spent a morning with three of our potters to see how a single mug moves from clay to kiln to cart.',
    category: 'Artisan Stories',
    date: 'April 30, 2026',
    image: '/images/pottery-hands-1.jpg',
  },
  {
    title: 'Our Zero-Plastic Packaging Promise',
    excerpt: 'Why every ClayCart order ships in biodegradable packaging, and what that actually costs us to do.',
    category: 'Sustainability',
    date: 'April 9, 2026',
    image: '/images/studio-6.jpg',
  },
  {
    title: 'Reading a Glaze: What Makes Each Piece Unique',
    excerpt: 'Glaze pooling, crackling, and color shift are not flaws — they are the fingerprint of the kiln.',
    category: 'Craft',
    date: 'March 22, 2026',
    image: '/images/studio-1.jpg',
  },
  {
    title: 'Styling Handmade Ceramics in a Modern Home',
    excerpt: 'A few notes on pairing textured, earthy pieces with minimalist interiors — from our own customers.',
    category: 'Home',
    date: 'March 3, 2026',
    image: '/images/studio-3.jpg',
  },
];

export default function Journal() {
  return (
    <div className="container-page py-14">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-clay-500">Journal</p>
        <h1 className="mt-2 text-3xl font-bold text-ink-900">Stories from the Wheel and Kiln</h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-600">
          Notes on craft, care, and the people behind every ClayCart piece.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {ARTICLES.map((article) => (
          <article
            key={article.title}
            className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink-100/60"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3 text-xs text-ink-400">
                <Badge tone="neutral">{article.category}</Badge>
                <span>{article.date}</span>
              </div>
              <h2 className="mt-3 text-lg font-bold text-ink-900">{article.title}</h2>
              <p className="mt-2 text-sm text-ink-600">{article.excerpt}</p>
              <button
                onClick={() => toast.info('Full articles are coming soon to the Journal.')}
                className="mt-4 text-sm font-semibold text-clay-600 hover:underline"
              >
                Read More →
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
