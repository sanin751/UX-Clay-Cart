import { useState } from 'react';
import { toast } from 'react-toastify';
import Button from '../components/ui/Button';

const FAQS = [
  {
    q: 'How long does shipping take?',
    a: 'Orders within the Kathmandu Valley typically arrive in 2-4 days. Deliveries to other regions across Nepal take 5-7 days.',
  },
  {
    q: 'What is your return policy?',
    a: 'We offer 7-day hassle-free returns on unused items in their original packaging.',
  },
  {
    q: 'How do I care for my ceramics?',
    a: 'Hand wash only with mild soap. Avoid abrasive scrubbers to preserve the natural glaze finish.',
  },
  {
    q: 'Are the glazes food safe?',
    a: 'Yes — every glaze we use is tested and certified food-safe for everyday use.',
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl bg-cream-100">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left font-medium text-ink-800"
      >
        {q}
        <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>⌄</span>
      </button>
      {open && <p className="px-5 pb-4 text-sm text-ink-600">{a}</p>}
    </div>
  );
}

export default function Support() {
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    toast.success('Thanks for sharing your experience with the ClayCart community!');
    setComment('');
  }

  return (
    <div className="container-page py-14">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-ink-900">Support &amp; Community</h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-600">
          We&apos;re here to help ensure your handcrafted journey is as seamless as the clay on our wheel. Find
          answers, share your story, or reach out to us directly.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-ink-900">
            <span aria-hidden="true">❓</span> Common Questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((item) => (
              <FaqItem key={item.q} {...item} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink-100/60">
            <h2 className="text-lg font-bold text-ink-900">Submit a Review</h2>
            <p className="mt-1 text-sm text-ink-600">Share your experience with the ClayCart community.</p>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div className="flex gap-1 text-2xl text-clay-500">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setRating(n)}>
                    {n <= rating ? '★' : '☆'}
                  </button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Tell us what you love about your new piece..."
                className="w-full rounded-xl border border-ink-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-clay-300"
              />
              <Button type="submit" size="sm">
                Post Review
              </Button>
            </form>
          </div>

          <div className="rounded-2xl bg-blush-100 p-6">
            <h3 className="text-lg font-bold text-ink-900">Still have questions?</h3>
            <p className="mt-1 text-sm text-ink-700">
              Our studio team is available Monday through Friday to assist with anything you need.
            </p>
            <Button
              size="sm"
              className="mt-4 w-full"
              onClick={() => toast.info('Live chat is coming soon — email us instead!')}
            >
              💬 Start Live Chat
            </Button>
            <a href="mailto:hello@claycart.com" className="mt-3 block text-center text-sm font-medium text-clay-700 hover:underline">
              ✉ hello@claycart.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
