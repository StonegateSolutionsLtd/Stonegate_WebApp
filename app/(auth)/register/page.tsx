import { Suspense } from 'react'
import RegisterForm from '@/components/auth/RegisterForm'

export const metadata = { title: 'Create Account — Stonegate Moves' }

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-zinc-900">Stonegate Moves</h1>
        <p className="text-zinc-500 mt-1 text-sm">Almost there — just create your account first.</p>
      </div>
      <Suspense>
        <RegisterForm />
      </Suspense>
    </div>
  )
}
