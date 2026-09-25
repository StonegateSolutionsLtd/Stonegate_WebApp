import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { MUNICIPALITIES } from '@/lib/patrol/municipalities'
import { getAllPatrolSummaries } from '@/lib/patrol/data'
import PatrolIntro from '@/components/patrol/PatrolIntro'
import PatrolExperience from '@/components/patrol/PatrolExperience'
import CostComparisonPanel from '@/components/patrol/CostComparisonPanel'

export const metadata: Metadata = {
  title: 'Stonegate Patrol · Route-Based Junk Removal',
  description:
    'A Stonegate truck patrols your neighbourhood on a set schedule. Book a pickup slot on an upcoming route across Vancouver, Burnaby, New Westminster, and Coquitlam for a fraction of the cost of a dedicated pickup.',
}

export default async function PatrolPage() {
  const summaries = await getAllPatrolSummaries()

  return (
    <div className="min-h-screen bg-background">
      <header className="flex h-16 items-center justify-between border-b border-border px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="" width={30} height={30} className="h-7 w-7 rounded-full object-cover" />
          <span className="text-sm font-bold tracking-tight text-foreground">
            Stonegate <span className="text-muted-foreground font-medium">Patrol</span>
          </span>
        </Link>
        <Link href="/" className="text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground">
          Back to Stonegate Moving Solutions
        </Link>
      </header>

      <PatrolIntro />

      <PatrolExperience municipalities={MUNICIPALITIES} summaries={summaries} />

      <CostComparisonPanel />
    </div>
  )
}
