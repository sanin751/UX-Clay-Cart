import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const VALUES = [
  { icon: '🌿', title: 'Ethically Sourced', copy: 'Clay and glaze materials sourced responsibly from local suppliers across Nepal.' },
  { icon: '🤝', title: 'Fair Wages', copy: 'Every artisan we work with is paid fairly for the time and skill each piece demands.' },
  { icon: '🔥', title: 'Traditional Firing', copy: 'Many pieces are still finished in wood-fired kilns, a craft passed through generations.' },
  { icon: '📦', title: 'Zero-Plastic Packaging', copy: '100% biodegradable packaging on every order, from the studio to your door.' },
];

const PROCESS = [
  { step: '01', title: 'Sourcing the Clay', copy: 'Iron-rich clay is sourced from the high plateau and prepared by hand for throwing.', image: '/images/studio-4.jpg' },
  { step: '02', title: 'Wheel-Thrown', copy: 'Each piece is centered and shaped on the wheel by a single artisan, start to finish.', image: '/images/pottery-hands-4.jpg' },
  { step: '03', title: 'Glazed & Fired', copy: 'Pieces are glazed in small batches and fired at high temperatures for lasting strength.', image: '/images/studio-2.jpg' },
  { step: '04', title: 'Quality Checked', copy: 'Every item is inspected by hand before it ever reaches your basket.', image: '/images/studio-7.jpg' },
];

const STATS = [
  { value: '50+', label: 'Independent Artisans' },
  { value: '7', label: 'Craft Collections' },
  { value: '100%', label: 'Plastic-Free Packaging' },
];

export default function OurStory() {
  return (
    <div>
      <section
        className="relative bg-cover bg-center py-24 text-white"
        style={{ backgroundImage: "url('/images/pottery-hands-3.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/80 via-ink-900/60 to-ink-900/85" />
        <div className="container-page relative text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-clay-200">Our Story</p>
          <h1 className="mx-auto mt-4 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
            Handcrafted Soul, Rooted in Nepal
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-white/80">
            ClayCart began with a simple belief — that the things we live with every day should carry the mark of
            the hands that made them. Every piece in our collection is thrown, glazed, and fired by independent
            artisans working in small studios across Nepal.
          </p>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-clay-500">Where it started</p>
            <h2 className="mt-2 text-2xl font-bold text-ink-900 sm:text-3xl">
              From a single wheel to a community of makers
            </h2>
            <p className="mt-4 text-ink-600">
              ClayCart started as a way to bring the work of a handful of potters in the Kathmandu Valley to homes
              beyond their studio walls. What began as a single wheel and a wood-fired kiln has grown into a network
              of independent artisans, each bringing their own technique — from unglazed terracotta to
              wood-ash glazes — to every collection we release.
            </p>
            <p className="mt-4 text-ink-600">
              We&apos;re intentionally slow. Pieces are made in small batches, and no two are ever quite identical —
              the small variations in glaze and form are proof that a real hand shaped what you&apos;re holding.
            </p>
            <Button as={Link} to="/shop" className="mt-6">
              Shop the Collection
            </Button>
          </div>
          <div className="relative">
            <img
              src="/images/pottery-hands-5.jpg"
              alt="An artisan shaping clay on a pottery wheel"
              className="aspect-[4/5] w-full rounded-2xl object-cover"
            />
            <div className="absolute -bottom-6 left-1/2 grid w-[92%] -translate-x-1/2 grid-cols-3 gap-4 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-ink-100/60">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold text-clay-600 sm:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-xs font-medium text-ink-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-ink-100 bg-cream-100 py-16 pt-24">
        <div className="container-page">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-clay-500">What we stand for</p>
            <h2 className="mt-2 text-2xl font-bold text-ink-900 sm:text-3xl">Our Values</h2>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-ink-100/60">
                <span className="text-2xl">{v.icon}</span>
                <h3 className="mt-3 font-semibold text-ink-900">{v.title}</h3>
                <p className="mt-2 text-sm text-ink-600">{v.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-clay-500">Craft &amp; Process</p>
          <h2 className="mt-2 text-2xl font-bold text-ink-900 sm:text-3xl">From Earth to Table</h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((p) => (
            <div key={p.step}>
              <div className="aspect-square overflow-hidden rounded-2xl">
                <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
              </div>
              <p className="mt-4 text-2xl font-bold text-clay-300">{p.step}</p>
              <h3 className="mt-1 font-semibold text-ink-900">{p.title}</h3>
              <p className="mt-2 text-sm text-ink-600">{p.copy}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
