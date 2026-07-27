import clsx from 'clsx';
import { swatchFor } from '../../utils/colorSwatches';

function VaseIcon({ className, style }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} style={style}>
      <path
        d="M26 8h12l2 8-3 4c3 4 5 9 5 15 0 10-6 17-14 17S14 45 14 35c0-6 2-11 5-15l-3-4 2-8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M24 8h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function ProductImage({ src, alt, className, imgClassName }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={clsx('h-full w-full object-cover', imgClassName)}
        loading="lazy"
      />
    );
  }

  const bg = swatchFor(alt);

  return (
    <div
      className={clsx('flex h-full w-full items-center justify-center', className)}
      style={{ backgroundColor: `${bg}33` }}
    >
      <VaseIcon className="h-1/3 w-1/3" style={{ color: bg }} />
    </div>
  );
}
