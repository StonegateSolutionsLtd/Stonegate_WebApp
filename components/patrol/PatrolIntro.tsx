import { MapPin, CalendarClock, Camera, PackageCheck, ArrowRight } from 'lucide-react'

const steps = [
  { Icon: MapPin, label: 'Select your area' },
  { Icon: CalendarClock, label: 'Check when the truck comes' },
  { Icon: Camera, label: 'Snap a photo, get an AI price' },
  { Icon: PackageCheck, label: 'Book your spot' },
] as const

export default function PatrolIntro() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6">
        <h1 className="shrink-0 text-lg font-bold tracking-tight text-foreground sm:text-xl">
          Book a spot on the truck already coming to your street.
        </h1>

        <ol className="flex flex-wrap items-center gap-x-1 gap-y-3 sm:gap-x-2">
          {steps.map(({ Icon, label }, i) => (
            <li key={label} className="flex items-center gap-1 sm:gap-2">
              <div className="flex items-center gap-2 rounded-full border border-border py-1.5 pr-3.5 pl-1.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-bold text-background">
                  {i + 1}
                </span>
                <Icon size={14} className="shrink-0 text-muted-foreground" aria-hidden />
                <span className="whitespace-nowrap text-xs font-semibold text-foreground">{label}</span>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight size={14} className="hidden shrink-0 text-muted-foreground/50 sm:block" aria-hidden />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
