'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'

const NAV = [
  { label: 'Moving Orders', href: '/admin/dashboard', icon: '🚛' },
  { label: 'Junk Removal', href: '/admin/junk-removal', icon: '🗑️' },
  { label: 'Bin Cleaning', href: '/admin/bin-cleaning', icon: '🧹' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
  }

  return (
    <>
      <style>{`
        .adm-sidebar {
          width: 220px;
          min-width: 220px;
          background: #254220;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          flex-shrink: 0;
        }
        .adm-sidebar-brand { padding: 20px 16px 16px; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .adm-sidebar-nav { padding: 12px 8px; flex: 1; }
        .adm-sidebar-foot { padding: 12px 8px; border-top: 1px solid rgba(255,255,255,0.1); }
        .adm-mobile-bar { display: none; }
        @media (max-width: 768px) {
          .adm-sidebar { display: none; }
          .adm-mobile-bar {
            display: flex;
            align-items: center;
            background: #254220;
            padding: 10px 12px;
            gap: 6px;
            overflow-x: auto;
            flex-shrink: 0;
          }
        }
      `}</style>

      {/* Desktop sidebar */}
      <nav className="adm-sidebar">
        <div className="adm-sidebar-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Image src="/logo.png" alt="Stonegate" width={28} height={28} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)', flexShrink: 0 }} />
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '13px', lineHeight: 1.2 }}>Admin Panel</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '10px', marginTop: '2px' }}>Stonegate Moving</div>
            </div>
          </div>
        </div>

        <div className="adm-sidebar-nav">
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '1px', padding: '0 8px 8px' }}>ORDERS</div>
          {NAV.map(item => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '9px 10px', borderRadius: '8px', marginBottom: '2px',
                  textDecoration: 'none',
                  background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                  color: active ? 'white' : 'rgba(255,255,255,0.6)',
                  fontSize: '13px', fontWeight: active ? 600 : 400,
                }}
              >
                <span style={{ fontSize: '14px' }}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="adm-sidebar-foot">
          <button
            onClick={handleLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 10px', borderRadius: '8px',
              background: 'transparent', border: 'none',
              color: 'rgba(255,255,255,0.5)', fontSize: '13px', cursor: 'pointer', textAlign: 'left',
            }}
          >
            <span>↩</span> Sign Out
          </button>
        </div>
      </nav>

      {/* Mobile top bar */}
      <div className="adm-mobile-bar">
        <Image src="/logo.png" alt="Stonegate" width={22} height={22} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)', flexShrink: 0 }} />
        {NAV.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: '5px 10px', borderRadius: '20px',
                textDecoration: 'none', whiteSpace: 'nowrap',
                background: active ? 'rgba(255,255,255,0.18)' : 'transparent',
                color: active ? 'white' : 'rgba(255,255,255,0.6)',
                fontSize: '12px', fontWeight: active ? 600 : 400,
              }}
            >
              {item.label}
            </Link>
          )
        })}
        <button
          onClick={handleLogout}
          style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.55)', fontSize: '12px', cursor: 'pointer', flexShrink: 0 }}
        >
          Sign Out
        </button>
      </div>
    </>
  )
}
