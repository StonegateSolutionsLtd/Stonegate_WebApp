import { Suspense } from 'react'
import LoginForm from '@/components/auth/LoginForm'

export const metadata = { title: 'Sign In — Stonegate Moves' }

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-zinc-900">Stonegate Moving Solutions</h1>
        <p className="text-zinc-500 mt-1 text-sm">Sign in to manage your orders.</p>
      </div>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
