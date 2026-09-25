import { Truck, PackagePlus, UserRound, Route } from 'lucide-react'

const options = [
  {
    Icon: Truck,
    label: 'Haul it yourself',
    price: '$150–250+',
    note: 'Truck rental, gas, and landfill tipping fees — plus your afternoon and the heavy lifting.',
  },
  {
    Icon: PackagePlus,
    label: 'Rent a dumpster',
    price: '$300–500+',
    note: "Flat fee whether it's full or not, sitting on your driveway for days while you load it.",
  },
  {
    Icon: UserRound,
    label: 'Dedicated pickup',
    price: '$150–190',
    note: 'A crew and truck sent out just for your load, wherever you are.',
  },
] as const

export default function CostComparisonPanel() {
  return (
    <section className="border-t border-border bg-background">
      <div className="mx-auto w-full max-w-[1600px] px-5 py-14 sm:px-8 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Compare your options
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Why Patrol costs less
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Instead of sending a dedicated truck across Metro Vancouver for one pickup, Patrol
          combines nearby pickups into one scheduled route — lowering the travel cost for everyone
          on it.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {options.map(({ Icon, label, price, note }) => (
            <div key={label} className="flex flex-col gap-3 rounded-2xl border border-border p-5">
              <Icon size={19} className="text-muted-foreground" aria-hidden />
              <div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="mt-0.5 font-mono text-lg font-bold text-foreground tabular-nums">{price}</p>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">{note}</p>
            </div>
          ))}

          <div className="flex flex-col gap-3 rounded-2xl border-2 border-foreground bg-muted/50 p-5">
            <Route size={19} className="text-foreground" aria-hidden />
            <div>
              <p className="text-sm font-bold text-foreground">Stonegate Patrol</p>
              <p className="mt-0.5 font-mono text-lg font-bold text-foreground tabular-nums">$79–109</p>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Same crew, same truck — shared with your neighbours already on the route.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
