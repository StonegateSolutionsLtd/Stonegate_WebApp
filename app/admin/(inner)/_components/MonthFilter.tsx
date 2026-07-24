'use client'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export default function MonthFilter({ value, max }: { value: string; max: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newMonth = e.target.value
    if (!newMonth) return
    const params = new URLSearchParams(searchParams.toString())
    params.set('month', newMonth)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <input
      type="month"
      value={value}
      max={max}
      onChange={handleChange}
      style={{
        padding: '6px 10px',
        borderRadius: '8px',
        border: '1.5px solid #E8E0D5',
        fontSize: '13px',
        fontWeight: 600,
        color: '#1A1714',
        background: 'white',
        cursor: 'pointer',
      }}
    />
  )
}
