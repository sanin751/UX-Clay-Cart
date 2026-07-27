import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProductImage from '../components/ui/ProductImage';
import RatingStars from '../components/ui/RatingStars';
import Button from '../components/ui/Button';
import { swatchFor } from '../utils/colorSwatches';
import formatCurrency from '../utils/formatCurrency';
import getErrorMessage from '../utils/getErrorMessage';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import * as productService from '../services/productService';
import * as reviewService from '../services/reviewService';
import * as cartService from '../services/cartService';
import * as wishlistService from '../services/wishlistService';

const SIZE_OPTIONS = ['Standard (2 Cups)', 'Family (4 Cups)'];
const TABS = ['Description', 'Specifications', 'Reviews', 'Shipping & Returns'];

function ReviewForm({ productId, onCreated }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const review = await reviewService.createReview({ productId, rating, comment });
      toast.success('Thanks for your review!');
      setComment('');
      onCreated(review);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not submit review'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-cream-100 p-5">
      <p className="text-sm font-semibold text-ink-800">Your rating</p>
      <div className="mt-2 flex gap-1 text-2xl text-clay-500">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} stars`}>
            {n <= rating ? '★' : '☆'}
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Tell us what you love about your new piece..."
        rows={3}
        className="mt-3 w-full rounded-xl border border-ink-100 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-clay-300"
      />
      <Button type="submit" size="sm" className="mt-3" disabled={submitting}>
        {submitting ? 'Posting...' : 'Post Review'}
      </Button>
    </form>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { refreshCart } = useCart();
  const { isSaved, refreshWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState(SIZE_OPTIONS[0]);
  const [engravingText, setEngravingText] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Description');
  const [busy, setBusy] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    let ignore = false;
    setProduct(null);
    setActiveImage(0);
    setQuantity(1);
    productService.getProduct(id).then((p) => {
      if (ignore) return;
      setProduct(p);
      setSelectedColor(p.colors?.[0] || '');
    });
    reviewService.getProductReviews(id).then((r) => !ignore && setReviews(r));
    return () => {
      ignore = true;
    };
  }, [id]);

  if (!product) {
    return <div className="container-page py-24 text-center text-ink-400">Loading product...</div>;
  }

  const price = product.discountPrice ?? product.price;
  const saved = isSaved(product._id);

  async function addToCart(redirectToCheckout) {
    if (!isAuthenticated) {
      toast.info('Please sign in to add items to your cart');
      navigate('/login');
      return;
    }
    setBusy(true);
    try {
      await cartService.addToCart({
        productId: product._id,
        quantity,
        selectedColor: selectedColor || undefined,
        variantLabel: selectedSize || undefined,
        engravingText: engravingText || undefined,
      });
      await refreshCart();
      toast.success(`${product.name} added to cart`);
      if (redirectToCheckout) navigate('/cart');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function toggleWishlist() {
    if (!isAuthenticated) {
      toast.info('Please sign in to save items');
      return;
    }
    try {
      if (saved) await wishlistService.removeFromWishlist(product._id);
      else await wishlistService.addToWishlist(product._id);
      await refreshWishlist();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  return (
    <div className="container-page py-10 pb-28 lg:pb-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="flex gap-4">
          <div className="hidden flex-col gap-3 sm:flex">
            {(product.images.length ? product.images : [null, null, null]).slice(0, 4).map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`h-16 w-16 overflow-hidden rounded-xl border-2 ${
                  activeImage === i ? 'border-clay-500' : 'border-transparent'
                }`}
              >
                <ProductImage src={img} alt={product.colors?.[i] || product.name} />
              </button>
            ))}
          </div>
          <div className="relative aspect-square flex-1 overflow-hidden rounded-2xl bg-cream-100">
            <ProductImage src={product.images[activeImage]} alt={selectedColor || product.name} />
            <button
              type="button"
              onClick={toggleWishlist}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-clay-600 shadow-sm"
            >
              {saved ? '♥' : '♡'}
            </button>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-clay-500">
            {product.category?.name || 'Handmade Collection'}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-ink-900">{product.name}</h1>
          <div className="mt-2 flex items-center gap-3">
            <RatingStars rating={product.ratingsAverage} count={product.ratingsCount} />
            <span className="text-sm font-medium text-sage-600">
              {product.stock > 0 ? '● In Stock' : 'Out of Stock'}
            </span>
          </div>
          <p className="mt-4 text-2xl font-bold text-clay-600">{formatCurrency(price)}</p>

          {(product.material || product.dimensions || product.weight) && (
            <div className="mt-6 rounded-xl bg-cream-100 p-4 text-sm text-ink-700">
              <p className="mb-1 font-semibold text-ink-800">Key Features:</p>
              <ul className="list-inside list-disc space-y-0.5">
                {product.material && <li>Material: {product.material}</li>}
                {product.dimensions && <li>Dimensions: {product.dimensions}</li>}
                {product.weight && <li>Weight: {product.weight}</li>}
                {product.glazeType && <li>Glaze: {product.glazeType}</li>}
              </ul>
            </div>
          )}

          {product.colors?.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-ink-800">Glaze Color</p>
              <div className="mt-2 flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    title={c}
                    onClick={() => setSelectedColor(c)}
                    className={`h-8 w-8 rounded-full ring-2 ring-offset-2 ${
                      selectedColor === c ? 'ring-clay-500' : 'ring-transparent'
                    }`}
                    style={{ backgroundColor: swatchFor(c) }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <p className="text-sm font-semibold text-ink-800">Text / Engraving</p>
            <input
              value={engravingText}
              onChange={(e) => setEngravingText(e.target.value)}
              maxLength={100}
              placeholder="Add text (optional)"
              className="mt-2 w-full rounded-xl border border-ink-100 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-clay-300"
            />
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold text-ink-800">Set Size</p>
            <div className="mt-2 flex gap-3">
              {SIZE_OPTIONS.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-xl border px-4 py-2 text-sm font-medium ${
                    selectedSize === size ? 'border-clay-500 text-clay-600' : 'border-ink-100 text-ink-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 hidden items-center gap-3 sm:flex">
            <div className="flex items-center rounded-full border border-ink-100">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2">
                −
              </button>
              <span className="w-8 text-center text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="px-3 py-2"
              >
                +
              </button>
            </div>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => addToCart(false)}
              disabled={busy || product.stock === 0}
            >
              Add to Cart
            </Button>
            <Button className="flex-1" onClick={() => addToCart(true)} disabled={busy || product.stock === 0}>
              Buy Now
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="flex gap-6 border-b border-ink-100">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 pb-3 text-sm font-medium ${
                activeTab === tab ? 'border-clay-500 text-clay-600' : 'border-transparent text-ink-500'
              }`}
            >
              {tab === 'Reviews' ? `Reviews (${reviews.length})` : tab}
            </button>
          ))}
        </div>

        <div className="py-8">
          {activeTab === 'Description' && <p className="max-w-3xl text-ink-700">{product.description}</p>}

          {activeTab === 'Specifications' && (
            <dl className="grid max-w-xl grid-cols-2 gap-y-3 text-sm">
              {[
                ['Material', product.material],
                ['Dimensions', product.dimensions],
                ['Weight', product.weight],
                ['Glaze Type', product.glazeType],
              ]
                .filter(([, v]) => v)
                .map(([label, value]) => (
                  <div key={label} className="contents">
                    <dt className="font-semibold text-ink-800">{label}</dt>
                    <dd className="text-ink-600">{value}</dd>
                  </div>
                ))}
            </dl>
          )}

          {activeTab === 'Reviews' && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-ink-900">Customer Reviews</h3>
                {isAuthenticated && (
                  <Button variant="outline" size="sm" onClick={() => setShowReviewForm((v) => !v)}>
                    Write a Review
                  </Button>
                )}
              </div>

              {showReviewForm && (
                <div className="mb-6">
                  <ReviewForm
                    productId={product._id}
                    onCreated={(review) => {
                      setReviews((r) => [review, ...r]);
                      setShowReviewForm(false);
                    }}
                  />
                </div>
              )}

              {reviews.length === 0 ? (
                <p className="text-ink-500">No reviews yet. Be the first to share your thoughts.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {reviews.map((review) => (
                    <div key={review._id} className="rounded-xl border border-ink-100 p-4">
                      <div className="flex items-center justify-between">
                        <RatingStars rating={review.rating} />
                        <span className="rounded-full bg-sage-50 px-2 py-0.5 text-[10px] font-semibold text-sage-700">
                          VERIFIED PURCHASE
                        </span>
                      </div>
                      <p className="mt-2 font-semibold text-ink-800">{review.user?.name || 'ClayCart Customer'}</p>
                      <p className="text-xs text-ink-400">
                        {new Date(review.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      {review.comment && <p className="mt-2 text-sm text-ink-700">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Shipping & Returns' && (
            <div className="max-w-2xl space-y-2 text-ink-700">
              <p>Free shipping across Nepal. Orders ship in 100% biodegradable, plastic-free packaging.</p>
              <p>7-day hassle-free returns on unused items in original packaging.</p>
              <p>
                Questions?{' '}
                <Link to="/support" className="text-clay-600 hover:underline">
                  Visit Support &amp; Community
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-ink-100 bg-white px-4 py-3 sm:hidden">
        <div>
          <p className="text-xs text-ink-500">{product.name}</p>
          <p className="font-bold text-clay-600">{formatCurrency(price)}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-full border border-ink-100">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-2 py-1">
              −
            </button>
            <span className="w-6 text-center text-sm">{quantity}</span>
            <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} className="px-2 py-1">
              +
            </button>
          </div>
          <Button size="sm" onClick={() => addToCart(false)} disabled={busy || product.stock === 0}>
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
