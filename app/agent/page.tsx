import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const metadata = { title: 'AI Move Assistant - Stonegate Moves' }

export default function AgentPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <Badge variant="secondary" className="mb-6">Coming Soon</Badge>
        <h1 className="text-3xl font-bold text-zinc-900">AI Move Assistant</h1>
        <p className="text-zinc-500 mt-4 leading-relaxed">
          Our AI assistant will guide you through your move, ask the right questions, and give you an instant price estimate - all in a simple chat.
        </p>
        <div className="mt-8 p-5 bg-white rounded-xl border border-zinc-200 text-left space-y-3">
          <p className="text-sm font-semibold text-zinc-700">What the assistant will do:</p>
          <ul className="text-sm text-zinc-500 space-y-2">
            <li className="flex gap-2"><span>•</span> Ask about your pickup and drop-off locations</li>
            <li className="flex gap-2"><span>•</span> Understand your apartment size and floors</li>
            <li className="flex gap-2"><span>•</span> Check for elevators and special items</li>
            <li className="flex gap-2"><span>•</span> Give you an instant price estimate</li>
            <li className="flex gap-2"><span>•</span> Hand off directly to order confirmation</li>
          </ul>
        </div>
        <div className="mt-8 flex flex-col gap-3">
          <Link href="/order">
            <Button variant="outline" className="w-full">
              Book manually instead →
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="w-full text-zinc-400">Back to home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
