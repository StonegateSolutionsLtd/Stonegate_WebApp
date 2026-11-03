import GoogleLogo from '@/components/GoogleLogo'
import { cn } from '@/lib/utils'
import { BUSINESS_PROFILES } from '@/lib/seo/site'

const GOOGLE_PROFILE = BUSINESS_PROFILES[0]

function StarIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path fill="#FBBC04" d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
    </svg>
  )
}

/**
 * Google "G" and five gold stars, straight on the background; links to the Google reviews.
 * Shown at the top of every main page's hero. `onLight` drops the shadow that keeps it readable on photos.
 */
export default function GoogleStars({ className, size = 'md', onLight = false }: { className?: string; size?: 'sm' | 'md'; onLight?: boolean }) {
  const star = size === 'sm' ? 15 : 19
  return (
    <a
      href={GOOGLE_PROFILE}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="5-star reviews on Google - read our reviews"
      className={cn(
        'inline-flex items-center w-fit transition-opacity hover:opacity-85',
        size === 'sm' ? 'gap-1.5' : 'gap-2',
        !onLight && '[filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.55))]',
        className,
      )}
    >
      <GoogleLogo size={size === 'sm' ? 17 : 21} />
      <span className="flex items-center gap-px">
        {Array.from({ length: 5 }, (_, i) => <StarIcon key={i} size={star} />)}
      </span>
    </a>
  )
}
