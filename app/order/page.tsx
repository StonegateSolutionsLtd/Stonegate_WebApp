import Link from 'next/link'
import Image from 'next/image'
import OrderForm from '@/components/order/OrderForm'

export const metadata = { title: 'Book Your Move - Stonegate Moving Solutions' }

export default function OrderPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF7F2' }}>

      {/* Top nav */}
      <header className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #E8E0D5' }}>
        <Link
          href="/"
          className="text-sm font-semibold transition-opacity opacity-60 hover:opacity-100"
          style={{ color: '#6B5E54' }}
        >
          ← Back
        </Link>

        {/* Logo mark */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center"
            style={{ backgroundColor: '#1C3318' }}>
            <Image src="/logo.png" alt="SG" width={28} height={28} className="object-contain" />
          </div>
          <span className="text-sm font-bold hidden sm:block" style={{ color: '#1A1714' }}>
            Stonegate Moving Solutions
          </span>
        </div>

        <div className="w-16" />
      </header>

      {/* Form area */}
      <main className="flex-1 flex flex-col items-center px-4 pt-10 pb-16">

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black tracking-tight" style={{ color: '#1A1714' }}>
            Book your move
          </h1>
          <p className="mt-2 text-base" style={{ color: '#9A8E83' }}>
            Takes about 2 minutes. We confirm within 24 hours.
          </p>
        </div>

        {/* Form */}
        <div className="w-full max-w-2xl">
          <OrderForm />
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {['Licensed & insured', 'Same-week availability', 'Transparent pricing'].map(item => (
            <div key={item} className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                style={{ backgroundColor: '#D6E8D3', color: '#4D6B47' }}>✓</span>
              <span className="text-sm" style={{ color: '#9A8E83' }}>{item}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
