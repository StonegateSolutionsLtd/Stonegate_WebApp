import Link from 'next/link'
import Image from 'next/image'
import OrderForm from '@/components/order/OrderForm'

export const metadata = { title: 'Book Your Move - Stonegate Moving Solutions' }

export default function OrderPage() {
  return (
    <div className="min-h-screen pt-4 sm:pt-8 flex flex-col" style={{ backgroundColor: '#1C3318' }}>



      {/* Cream canvas */}
      <div
        className="relative z-10 flex-1 rounded-t-2xl flex flex-col items-center justify-start px-6 pt-10 pb-12"
        style={{ backgroundColor: '#F5F0EB' }}
      >
        {/* Subtle dot grid pattern */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #C4B8AC 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            opacity: 0.35,
          }}
        />

        {/* Big logo watermark inside canvas */}
        <div className="absolute bottom-0 right-0 pointer-events-none select-none"
          style={{ opacity: 0.12, filter: 'invert(1)' }}>
          <Image src="/logo.png" alt="" width={340} height={340} className="object-contain" />
        </div>

        <Link href="/"
          className="absolute top-5 left-6 text-sm font-semibold opacity-50 hover:opacity-100 transition-opacity z-20"
          style={{ color: '#6B5E54' }}>
          ← Back
        </Link>

        <div className="relative z-10 w-full max-w-xl">
          <div className="mb-8">
            <h1 className="text-4xl font-black tracking-tight" style={{ color: '#1A1714' }}>
              Book your move
            </h1>
            <p className="mt-2 text-base" style={{ color: '#9A8E83' }}>
              Takes about 2 minutes · Confirmed within 24 hours
            </p>
          </div>

          <OrderForm />

          <div className="flex flex-wrap justify-center gap-5 mt-7">
            {['Licensed & insured', 'Same-week slots', 'Fixed pricing'].map(item => (
              <div key={item} className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{ backgroundColor: '#D6E8D3', color: '#4D6B47' }}>✓</span>
                <span className="text-sm" style={{ color: '#9A8E83' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
