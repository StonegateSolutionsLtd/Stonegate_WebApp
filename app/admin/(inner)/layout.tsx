import AdminSidebar from './_components/AdminSidebar'

export default function InnerAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <style>{`
        .admin-shell {
          display: flex;
          flex-direction: row;
          min-height: 100vh;
          background: #FAF7F2;
        }
        @media (max-width: 768px) {
          .admin-shell { flex-direction: column; }
        }
      `}</style>
      <AdminSidebar />
      <main style={{ flex: 1, minWidth: 0 }}>
        {children}
      </main>
    </div>
  )
}
