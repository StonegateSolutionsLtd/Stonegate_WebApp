'use client'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{ background: 'white', color: '#254220', border: 'none', padding: '8px 18px', borderRadius: '6px', fontFamily: 'inherit', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
    >
      Print / Save as PDF
    </button>
  )
}
