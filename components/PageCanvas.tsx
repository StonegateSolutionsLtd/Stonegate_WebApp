import Image from 'next/image'
import Link from 'next/link'

export default function PageCanvas({
  children,
  backHref = '/',
  backLabel = '← Back',
}: {
  children: React.ReactNode
  backHref?: string
  backLabel?: string
}) {
  return (
    <div className="min-h-screen p-4 sm:p-8 flex flex-col" style={{ backgroundColor: '#1C3318' }}>
      {/* Cream canvas */}
      <div
        className="relative z-10 flex-1 rounded-2xl flex flex-col items-center justify-start px-6 pt-24 pb-12 overflow-hidden"
        style={{ backgroundColor: '#F5F0EB' }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #C4B8AC 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            opacity: 0.35,
          }}
        />

        {/* Logo watermark */}
        <div className="absolute bottom-0 right-0 pointer-events-none select-none"
          style={{ opacity: 0.12, filter: 'invert(1)' }}>
          <Image src="/logo.png" alt="" width={340} height={340} className="object-contain" />
        </div>

        {/* Back link */}
        <Link
          href={backHref}
          className="absolute top-5 left-6 text-sm font-semibold opacity-50 hover:opacity-100 transition-opacity z-20"
          style={{ color: '#6B5E54' }}
        >
          {backLabel}
        </Link>

        {/* Page content */}
        <div className="relative z-10 w-full">
          {children}
        </div>
      </div>
    </div>
  )
}
