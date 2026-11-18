import type { Faq, SeoImage } from './site'
import { TRAVEL_RATE_PER_HOUR } from '@/lib/travel-fee-info'

export interface PhotoCredit {
  /** e.g. 'Leoboudv / Wikimedia Commons' */
  author: string
  license: string
  href: string
}

/** A real local photo of the city (not of our crew), shown with its credit */
export interface CityPhoto extends SeoImage {
  credit: PhotoCredit
}

/**
 * Typical weekday drive for our truck: out to this part of the city for a 9am start, and back after a 2pm finish.
 * Minutes from Mapbox driving-traffic predictions (checked 2026-11-17), so they include usual traffic.
 */
export interface CityTrip {
  area: string
  out: number
  back: number
  km: number
}

/** Something local to know before moving day, with the official page it comes from */
export interface AccessNote {
  title: string
  text: string
  source?: { label: string; href: string }
}

export interface City {
  slug: string
  name: string
  /** Set for cities that use dedicated standalone pages instead of the template */
  movingHref?: string
  title: string
  description: string
  keywords: string[]
  /** Hero headline when it should differ from "<name> / Movers" */
  heading?: [string, string]
  lead: string
  /** H2 of the "moving in this city" section, different on every page */
  movingHeading?: string
  /** Links to related pages are written inline as [text](/path) */
  moving: string
  /** The 3-4 moving services most relevant here, as service slugs */
  services: ('local' | 'residential' | 'commercial' | 'office' | 'packing' | 'apartment' | 'long-distance' | 'senior' | 'specialty')[]
  localTip: { title: string; text: string }
  neighbourhoods: string[]
  faqs: Faq[]
  nearby: string[]
  photo?: CityPhoto
  trips?: CityTrip[]
  access?: AccessNote[]
  /** Only from our own job calendar; leave out when we have no real moves to point to */
  ourMoves?: string
}

/** Our travel fee for one trip: the truck's drive out and back at the travel rate, rounded to $5 */
export function travelFee(t: CityTrip) {
  return Math.round(((t.out + t.back) / 60) * TRAVEL_RATE_PER_HOUR / 5) * 5
}

/** "$90" or "$160 to $170" across the city's areas */
export function travelFeeRange(c: City) {
  const fees = (c.trips ?? []).map(travelFee)
  if (!fees.length) return null
  const lo = Math.min(...fees), hi = Math.max(...fees)
  return lo === hi ? `$${lo}` : `$${lo} to $${hi}`
}

/** Real crew and truck photos for the city page heroes, rotated so neighbouring pages differ. They are not taken in each city, so the alt text doesn't say so */
const HERO_PHOTOS: SeoImage[] = [
  { src: '/hero-truck-home-natural.jpg', alt: 'Stonegate moving truck parked in a customer\'s driveway', pos: 'center 60%' },
  { src: '/hero-left.jpg', alt: 'Stonegate moving truck on a residential street at dusk', brightness: 1.45 },
  { src: '/about/photo-3.jpg', alt: 'The Stonegate moving crew in front of their truck', pos: 'center 62%' },
]

const commons = (author: string, license: string, file: string): PhotoCredit => ({
  author: `${author} / Wikimedia Commons`,
  license,
  href: `https://commons.wikimedia.org/wiki/File:${file}`,
})

const STRATA_REG = { label: 'BC Laws: Strata Property Regulation, s. 6.9', href: 'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/43_2000' }
const MASSEY_COUNTERFLOW = { label: 'Province of BC: George Massey Tunnel counterflow', href: 'https://www2.gov.bc.ca/gov/content/transportation/driving-and-cycling/traveller-information/routes-and-driving-conditions/counterflow' }
const PARK_TRAFFIC_2021 = { label: 'Metro Vancouver: traffic and parking rules at Belcarra Regional Park and Buntzen Lake', href: 'https://belcarra.ca/assets/media/2021/03/2021-03-31-Metro-Vancouver-Media-Advisory-re-New-Traffic-Parking-Rules-at-Belcarra-Regional-Park-Buntzen-Lake-Starting-April-1.pdf' }

export const CITIES: City[] = [
  {
    slug: 'vancouver',
    name: 'Vancouver',
    title: 'Downtown & City of Vancouver Movers',
    description: 'Movers for the City of Vancouver: Downtown and Yaletown towers, West End walk-ups, Kitsilano and East Van houses. Elevator, loading bay and street permit planned. From $130/hr + GST.',
    keywords: ['Downtown Vancouver movers', 'condo movers Vancouver', 'Yaletown movers', 'West End movers', 'Kitsilano movers', 'East Vancouver movers'],
    heading: ['City of Vancouver', 'Movers'],
    lead: 'Apartment, condo and house moves across the City of Vancouver - from Downtown towers to East Van character homes. We wrap, load, move and set up.',
    movingHeading: 'In Vancouver, the Building Sets the Schedule',
    moving: 'Towers in Downtown, Yaletown and the West End book elevators and loading bays in fixed windows, so we plan the crew around your slot rather than the other way round. Kitsilano and East Van character houses bring a different puzzle: narrow front stairs, basement suites and street-only parking. Condo moves follow our [apartment and condo moving](/apartment-moving) process, and the [Vancouver condo moving checklist](/guides/vancouver-condo-moving-checklist) covers what to book with your strata first. Moving a whole house? See [how long a house move takes](/guides/how-long-does-it-take-to-move-a-house).',
    services: ['apartment', 'residential', 'office', 'packing'],
    localTip: { title: 'Moving in or out of a Vancouver high-rise?', text: 'Most Downtown and Yaletown buildings need a move-in or move-out elevator booking and a loading bay reservation. Book both for your moving window and we will handle everything else.' },
    neighbourhoods: ['Downtown', 'Yaletown', 'West End', 'Coal Harbour', 'Kitsilano', 'Mount Pleasant', 'Fairview', 'Kerrisdale', 'Dunbar', 'Point Grey', 'Commercial Drive', 'Hastings-Sunrise', 'Marpole', 'Oakridge', 'Killarney', 'Renfrew', 'South Granville', 'UBC'],
    faqs: [
      { q: 'Do you move people in and out of Downtown Vancouver condos?', a: 'Yes. We work around your building\'s elevator booking and loading bay rules, and plan the crew to fit your booked window.' },
      { q: 'What if my building has no loading bay?', a: 'Then the truck parks on the street. The City of Vancouver can reserve curb space or meters for your moving day with a temporary street occupancy permit; apply 7 to 10 business days ahead.' },
    ],
    nearby: ['burnaby', 'north-vancouver', 'richmond', 'new-westminster'],
    photo: {
      src: '/guides/vancouver-west-end-condo-towers.jpg',
      alt: 'Apartment and condo towers in Vancouver\'s West End seen from the Burrard Street Bridge',
      pos: 'center 40%',
      credit: commons('Robert Ashworth', 'CC BY 2.0', 'Dense_west_end_apartments_from_Burrard_Street_Bridge_(7735482928).jpg'),
    },
    trips: [
      { area: 'Downtown, Yaletown & West End', out: 49, back: 59, km: 28 },
      { area: 'Mount Pleasant & Fairview', out: 45, back: 55, km: 26 },
    ],
    access: [
      { title: 'No loading bay? Reserve the curb', text: 'The City of Vancouver can hold metered spaces or a stretch of curb for the truck with a temporary street occupancy permit. Apply 7 to 10 business days before the move.', source: { label: 'City of Vancouver: reserve parking spaces and meters', href: 'https://vancouver.ca/streets-transportation/reserve-metered-spaces.aspx' } },
      { title: 'Ask about the move-in fee', text: 'In BC a strata can only charge a move-in or move-out fee that is set in its bylaws or ratified rules, and it has to be reasonable. Ask your building manager for the amount and any refundable deposit before moving day.', source: STRATA_REG },
      { title: 'Start early, pay less travel', text: 'In typical weekday traffic the truck\'s afternoon drive back is about 10 minutes longer than the morning drive in. An early start keeps both legs, and your travel fee, shorter.' },
    ],
    ourMoves: 'At least 2 of our own moves since August 2026 started in the City of Vancouver, and in October 2026 we moved a 2-bedroom home from New Westminster into Vancouver.',
  },
  {
    slug: 'surrey',
    name: 'Surrey',
    title: 'Surrey Movers - Whalley, Guildford, Cloverdale & South Surrey',
    description: 'Surrey movers about 10 minutes from Surrey Centre: apartment, townhouse and house moves from Whalley and Guildford to Cloverdale and South Surrey. From $130/hr + GST, with one of our lowest travel fees.',
    keywords: ['Surrey movers', 'movers in Surrey BC', 'South Surrey movers', 'Cloverdale movers', 'Guildford movers', 'local moving company Surrey'],
    lead: 'Our truck starts its day in Surrey, so Surrey moves get the shortest drive and one of the lowest travel fees we charge.',
    movingHeading: 'Surrey Moves, Minutes From Our Truck',
    moving: 'Surrey covers a lot of ground: towers around Surrey Centre and Whalley, townhouse complexes in Guildford, Fleetwood and Clayton, and family homes in Cloverdale and South Surrey with full garages. A 1 or 2-bedroom apartment is a 2-mover job; anything bigger usually goes faster with 3 movers and the 16\' truck, and our [2 vs 3 movers guide](/guides/2-vs-3-movers) shows the maths. For a full house start with [residential moving](/residential-moving), and if you are heading out of the region see [long-distance moving](/long-distance-moving).',
    services: ['residential', 'apartment', 'long-distance', 'packing'],
    localTip: { title: 'Moving a full house in Surrey?', text: 'For a 3+ bedroom home, our 3-mover crew with the 16\' truck usually saves time overall. Tell us the size of your home when you book and we will suggest the right crew.' },
    neighbourhoods: ['Whalley', 'City Centre', 'Guildford', 'Fleetwood', 'Newton', 'Cloverdale', 'Clayton', 'Fraser Heights', 'Panorama Ridge', 'South Surrey', 'Morgan Creek', 'Grandview Heights', 'Sullivan Heights'],
    faqs: [
      { q: 'Is the travel fee lower for Surrey moves?', a: 'Yes. Our truck starts the day in Surrey, so a move within north Surrey usually has a travel fee of about $30, and South Surrey about $95. We confirm the exact amount from your addresses before you book.' },
      { q: 'Can the truck stay parked overnight for a two-day move?', a: 'Not on a Surrey street. The City bans heavy commercial vehicles from parking on any street from 7 pm to 7 am, so a two-day move is planned around the truck coming back the next morning.' },
    ],
    nearby: ['delta', 'langley', 'white-rock', 'new-westminster'],
    photo: {
      src: '/locations/surrey.jpg',
      alt: 'Surrey Central City tower and the Whalley skyline from above',
      credit: commons('Leoboudv', 'CC BY-SA 3.0', 'Surrey_Central_City_Shopping_Centre_%26_Office_Tower_(High_Rise_Tower_view-2011).jpg'),
    },
    trips: [
      { area: 'Surrey Centre, Whalley & Guildford', out: 10, back: 9, km: 4 },
      { area: 'South Surrey', out: 25, back: 31, km: 28 },
    ],
    access: [
      { title: 'Load and go: Surrey\'s truck parking rule', text: 'Surrey lets heavy commercial vehicles (over 5,000 kg licensed weight) park on residential streets only to load or unload, and bans them from parking on any Surrey street from 7 pm to 7 am.', source: { label: 'City of Surrey: Truck parking', href: 'https://www.surrey.ca/city-services/791.aspx' } },
      { title: 'Townhouse complex? Check where a truck can stop', text: 'Many Surrey complexes only have visitor stalls near the entrance. Ask your strata where a moving truck may stop and tell us how far that is from your door, so we bring enough hands for the carry.' },
      { title: 'North vs South Surrey', text: 'From Surrey Centre and Whalley the truck is about 10 minutes away. South Surrey is 25 to 30 minutes each way, which is why its travel fee is higher.' },
    ],
    ourMoves: 'At least 5 of our own moves since August 2026 started in Surrey.',
  },
  {
    slug: 'burnaby',
    name: 'Burnaby',
    movingHref: '/burnaby-movers',
    title: 'Burnaby Movers',
    description: 'Movers in Burnaby, BC.',
    keywords: ['Burnaby movers'],
    lead: '',
    moving: '',
    services: ['apartment', 'residential', 'packing'],
    localTip: { title: '', text: '' },
    neighbourhoods: ['Metrotown', 'Brentwood', 'Burnaby Heights', 'Edmonds', 'Lougheed', 'Deer Lake', 'Capitol Hill', 'Burnaby Mountain'],
    faqs: [],
    nearby: ['vancouver', 'new-westminster', 'coquitlam', 'richmond'],
  },
  {
    slug: 'richmond',
    name: 'Richmond',
    title: 'Richmond Movers - City Centre Condos, Steveston & Townhouses',
    description: 'Richmond, BC movers for City Centre condos along No. 3 Road, townhouse complexes and family homes in Steveston and Terra Nova. From $130/hr + GST, travel fee about $125.',
    keywords: ['Richmond BC movers', 'movers Richmond', 'Steveston movers', 'condo movers Richmond', 'townhouse movers Richmond'],
    lead: 'Condo, townhouse and house moves across Richmond, from the towers along No. 3 Road to Steveston and Terra Nova.',
    movingHeading: 'Richmond: Towers, Townhouses and a Bridge Either Way',
    moving: 'Richmond sits on islands in the Fraser, so every move here starts or ends with a bridge or the tunnel. City Centre moves are mostly towers along No. 3 Road and the Canada Line, with booked elevators; the rest of the city is townhouse complexes and houses on long, flat streets. Condo moves follow our [apartment and condo moving](/apartment-moving) process. Not sure how much truck a townhouse needs? Read [what size moving truck you need](/guides/what-size-moving-truck-do-i-need), and add [packing services](/packing-services) if you want it boxed for you.',
    services: ['apartment', 'residential', 'packing'],
    localTip: { title: 'Moving from a townhouse complex?', text: 'Many Richmond complexes limit where trucks can park. Tell us your unit\'s location and any strata rules so we can plan the shortest carry.' },
    neighbourhoods: ['City Centre', 'Brighouse', 'Steveston', 'Terra Nova', 'Thompson', 'Seafair', 'Broadmoor', 'Ironwood', 'Hamilton', 'East Richmond', 'Blundell', 'Shellmont'],
    faqs: [
      { q: 'Do you move condos in Richmond City Centre?', a: 'Yes. We work within each building\'s elevator booking and loading rules along No. 3 Road and across Richmond.' },
      { q: 'Can you move us between Richmond and Ladner or Tsawwassen?', a: 'Yes. We time the trip through the George Massey Tunnel around its weekday counterflow, so the loaded truck is not stuck in the one-lane direction.' },
    ],
    nearby: ['vancouver', 'delta', 'burnaby', 'new-westminster'],
    photo: {
      src: '/locations/richmond.jpg',
      alt: 'Fishing boats at the wharf in Steveston Village, Richmond',
      credit: commons('William Chen', 'CC BY-SA 4.0', 'Fishing_Vessel_Lady_Valerie_at_Steveston_Village%27s_Fishing_Wharf_in_Richmond,_British_Columbia,_Canada,_during_stormy_weather.jpg'),
    },
    trips: [
      { area: 'City Centre & Brighouse', out: 38, back: 37, km: 30 },
    ],
    access: [
      { title: 'Using a moving bin or storage container?', text: 'Richmond needs a permit (form TO-7) before a moving or storage bin is placed on a city road or boulevard. Your driveway does not need one.', source: { label: 'City of Richmond: Street use for special purposes', href: 'https://richmond.ca/services/transportation/special.htm' } },
      { title: 'Going through the Massey Tunnel?', text: 'On weekdays the tunnel runs counterflow: three lanes northbound from about 5:45 to 9:30 am, three lanes southbound from about 3 to 6:30 pm (September to June). Heading south in the morning or north in the afternoon means a single lane.', source: MASSEY_COUNTERFLOW },
    ],
  },
  {
    slug: 'coquitlam',
    name: 'Coquitlam',
    title: 'Coquitlam Movers - Burquitlam, Westwood Plateau & Burke Mountain',
    description: 'Coquitlam movers for Burquitlam and Coquitlam Centre condos and hillside homes on Westwood Plateau and Burke Mountain. From $130/hr + GST, travel fee about $90 to $120.',
    keywords: ['Coquitlam movers', 'movers Coquitlam BC', 'Burke Mountain movers', 'Westwood Plateau movers', 'Burquitlam condo movers'],
    lead: 'Condo moves along the Millennium Line and house moves up the hills of Westwood Plateau and Burke Mountain.',
    movingHeading: 'Coquitlam: Condo Towers Below, Hillside Homes Above',
    moving: 'Coquitlam has two kinds of moves. Down by Lougheed, Burquitlam and Coquitlam Centre it is condo towers along the Millennium Line, with elevator bookings. Up the hill, Westwood Plateau and Burke Mountain mean multi-level homes, steep driveways and stairs at both ends. Most of those houses are bigger than a 2-bedroom, which means our 3-mover crew; the [2 vs 3 movers guide](/guides/2-vs-3-movers) explains why it usually costs less overall. Houses follow our [residential moving](/residential-moving) process, towers our [apartment and condo moving](/apartment-moving) one.',
    services: ['residential', 'apartment', 'packing'],
    localTip: { title: 'Steep driveway or lots of stairs?', text: 'Let us know when you book - we bring the right crew size so heavy pieces come out safely and the move stays on schedule.' },
    neighbourhoods: ['Burquitlam', 'Coquitlam Centre', 'Westwood Plateau', 'Burke Mountain', 'Maillardville', 'Austin Heights', 'Ranch Park', 'Eagle Ridge', 'Harbour Chines', 'River Springs'],
    faqs: [
      { q: 'Do you move homes on Burke Mountain and Westwood Plateau?', a: 'Yes. Tell us about stairs and the driveway when you book; for homes bigger than a 2-bedroom we send 3 movers with the 16\' truck.' },
      { q: 'Can you move us on a Sunday in Coquitlam?', a: 'Yes. Coquitlam closes Pipeline Road, David Avenue and Pinetree Way to truck travel on Sundays and holidays, so we confirm the route to your address ahead of time.' },
    ],
    nearby: ['port-coquitlam', 'port-moody', 'burnaby', 'new-westminster'],
    photo: {
      src: '/locations/coquitlam.jpg',
      alt: 'Coquitlam condo towers rising behind a residential street of houses',
      credit: commons('Alex of Canada', 'CC BY-SA 4.0', 'Coquitlam_May_2_2018.jpeg'),
    },
    trips: [
      { area: 'Coquitlam Centre & Burquitlam', out: 25, back: 30, km: 17 },
      { area: 'Burke Mountain', out: 33, back: 39, km: 22 },
    ],
    access: [
      { title: 'Sunday truck routes', text: 'Coquitlam closes Pipeline Road, David Avenue and Pinetree Way to truck travel on Sundays and statutory holidays. For a Sunday move on Westwood Plateau or Burke Mountain, send your address early so we can plan the route.', source: { label: 'City of Coquitlam: Exemption permits and truck routes', href: 'https://coquitlam.ca/614/Exemption-Permits' } },
      { title: 'Up the hill costs a little more', text: 'Coquitlam Centre is about 25 minutes from our truck; Burke Mountain is closer to 35 each way, so its travel fee is about $30 higher.' },
    ],
    ourMoves: 'At least 2 of our own moves since August 2026 started in Coquitlam.',
  },
  {
    slug: 'new-westminster',
    name: 'New Westminster',
    title: 'New Westminster Movers - Walk-Ups, Heritage Homes & The Quay',
    description: 'New Westminster movers about 10 minutes from our truck: walk-up apartments, heritage houses and Quay condos. From $130/hr + GST, travel fee about $35.',
    keywords: ['New Westminster movers', 'New West movers', 'walk-up apartment movers New Westminster', 'Queens Park movers', 'Quay condo movers'],
    lead: 'Walk-up apartments, heritage houses and Quay condos across New Westminster, about 10 minutes from where our truck parks.',
    movingHeading: 'New West: Hills, Walk-Ups and a 10-Minute Drive',
    moving: 'New Westminster is built on the hillside above the Fraser, and it shows on moving day: Brow of the Hill and Uptown walk-ups with no elevator, Queens Park heritage houses with tight staircases, and newer towers down at the Quay. We take apart what will not fit the stairwell and rebuild it in your new place. Walk-ups follow our [apartment and condo moving](/apartment-moving) process, pianos and heavy pieces on narrow stairs come under [specialty moving](/specialty-moving), and [moving prices](/pricing/moving) shows what a short local move costs.',
    services: ['apartment', 'residential', 'specialty'],
    localTip: { title: 'Walk-up apartment?', text: 'Many New West buildings have no elevator. Tell us the floor when you book so we bring the right crew for the stairs.' },
    neighbourhoods: ['Downtown', 'Uptown', 'Sapperton', 'Queens Park', 'Brow of the Hill', 'Queensborough', 'Connaught Heights', 'West End', 'Victory Heights', 'The Quay'],
    faqs: [
      { q: 'Can you move us out of a walk-up with no elevator?', a: 'Yes. Stairs are part of most New West moves - just tell us the floor when you book.' },
      { q: 'Why is the travel fee so low for New Westminster?', a: 'Our truck parks about 10 minutes away, so a move within New West usually has a travel fee of about $35.' },
    ],
    nearby: ['burnaby', 'coquitlam', 'surrey', 'richmond'],
    photo: {
      src: '/locations/new-westminster.jpg',
      alt: 'New Westminster Quay and downtown towers along the Fraser River',
      credit: commons('Dennis Sylvester Hurd', 'CC BY 2.0', 'Most_of_the_Quay_and_Downtown_New_West_(50208375532).jpg'),
    },
    trips: [
      { area: 'Downtown, Uptown & the Quay', out: 10, back: 10, km: 5 },
    ],
    access: [
      { title: 'Holding the curb needs two weeks', text: 'New West reserves street space with a Street Occupancy Permit; moving trucks don\'t need a traffic management plan. Review takes 5 to 10 business days and No Parking signs must be up 72 hours ahead, so apply about two weeks out. 2026 fees start at a $128 application plus $59.50 per block face per day on local streets.', source: { label: 'City of New Westminster: Street Occupancy Permit', href: 'https://www.newwestcity.ca/services/streets-and-sidewalks/street-occupancy-permit' } },
      { title: 'The new bridge keeps it close', text: 'The stal̕əw̓asəm (Riverview) Bridge replaced the old Pattullo Bridge and opened to all traffic in February 2026. It is the direct link between Surrey and New West, and keeps our drive to you around 10 minutes.', source: { label: 'Pattullo Bridge Replacement Project', href: 'https://www.pattullobridgereplacement.ca/' } },
    ],
    ourMoves: 'In October 2026 we moved a 2-bedroom home from New Westminster to Vancouver.',
  },
  {
    slug: 'north-vancouver',
    name: 'North Vancouver',
    title: 'North Vancouver Movers - Lonsdale, Lynn Valley & Deep Cove',
    description: 'North Vancouver movers for Lonsdale condos and hillside homes in Lynn Valley, Edgemont and Deep Cove, City and District. From $130/hr + GST, travel fee about $160 to $170.',
    keywords: ['North Vancouver movers', 'North Van movers', 'Lonsdale condo movers', 'Lynn Valley movers', 'Deep Cove movers', 'North Shore moving company'],
    lead: 'Condo and house moves across the City and District of North Vancouver, from Lonsdale towers to Lynn Valley and Deep Cove homes.',
    movingHeading: 'North Shore Moves Run on Bridge Time',
    moving: 'Two things shape a North Vancouver move: the bridges and the slope. The drive in takes about 40 minutes and the afternoon trip back closer to an hour, so we start North Shore moves early. Then come the houses: split-levels and long stair runs in Lynn Valley, Edgemont and Upper Lonsdale, with the truck often parked on a grade. Lonsdale towers follow our [apartment and condo moving](/apartment-moving) process, hillside houses our [residential moving](/residential-moving) one, and [packing services](/packing-services) can take the boxing off your list.',
    services: ['residential', 'apartment', 'packing'],
    localTip: { title: 'Book a morning start', text: 'A morning start keeps the drive back over the bridge out of the worst of the afternoon traffic, which keeps the travel fee down.' },
    neighbourhoods: ['Lower Lonsdale', 'Central Lonsdale', 'Lynn Valley', 'Deep Cove', 'Edgemont', 'Capilano', 'Upper Lonsdale', 'Seymour', 'Norgate', 'Lynnmour', 'Blueridge'],
    faqs: [
      { q: 'Do you serve both the City and District of North Vancouver?', a: 'Yes - from Lower Lonsdale to Deep Cove, Lynn Valley and Edgemont. They are separate municipalities, so street permits come from whichever one you live in.' },
      { q: 'Do I need a permit for the truck in the City of North Vancouver?', a: 'Only if you want street parking reserved. The City issues a Temporary Street Use Permit; the application and payment are due 10 full business days before the move.' },
    ],
    nearby: ['west-vancouver', 'vancouver', 'burnaby'],
    photo: {
      src: '/locations/north-vancouver.jpg',
      alt: 'Lonsdale Avenue in North Vancouver',
      credit: commons('ChrisStubbs', 'CC BY-SA 3.0', 'Lonsdale_Avenue,_North_Vancouver_-_panoramio.jpg'),
    },
    trips: [
      { area: 'Lonsdale', out: 42, back: 55, km: 30 },
      { area: 'Lynn Valley', out: 40, back: 57, km: 29 },
      { area: 'Deep Cove', out: 45, back: 58, km: 32 },
    ],
    access: [
      { title: 'Reserving the curb in the City of North Van', text: 'The City of North Vancouver uses a Temporary Street Use Permit to reserve parking for a moving truck. The application and payment must be in 10 full business days before the move, and reserved parking carries a minimum $100 signage charge. Applications go to StreetUsePermit@cnv.org.', source: { label: 'City of North Vancouver: Street use permits', href: 'https://cnv.org/Streets-Transportation/Street-Use-Permits' } },
      { title: 'City or District?', text: 'Lynn Valley, Deep Cove, Edgemont and Seymour are in the District of North Vancouver, a separate municipality from the City around Lonsdale. Ask the one you live in about street permits.' },
    ],
  },
  {
    slug: 'west-vancouver',
    name: 'West Vancouver',
    title: 'West Vancouver Movers - Ambleside, British Properties & Horseshoe Bay',
    description: 'West Vancouver movers for houses, condos and downsizing moves in Ambleside, Dundarave, British Properties and Horseshoe Bay. From $130/hr + GST, travel fee about $190 to $210.',
    keywords: ['West Vancouver movers', 'West Van movers', 'British Properties movers', 'Ambleside movers', 'downsizing movers West Vancouver'],
    lead: 'House, condo and downsizing moves across West Vancouver, from Ambleside condos to British Properties homes.',
    movingHeading: 'West Van: Long Driveways, Fine Furniture, a Long Drive Back',
    moving: 'West Vancouver is one of our longest regular drives, and the afternoon trip back over the bridge is the slowest leg we plan for. The homes make the planning worth it: British Properties and Caulfeild houses with long, steep driveways, Ambleside and Dundarave condos, and downsizing moves from a family house to something smaller. Downsizing? See [senior moving](/senior-moving). Art, antiques and pianos come under [specialty moving](/specialty-moving), and [moving prices](/pricing/moving) explains how the travel fee is added.',
    services: ['senior', 'specialty', 'packing'],
    localTip: { title: 'Downsizing?', text: 'Moving to a smaller home? Tell us which pieces are coming with you and we will plan the crew and truck around just those.' },
    neighbourhoods: ['Ambleside', 'Dundarave', 'British Properties', 'Caulfeild', 'Horseshoe Bay', 'Park Royal', 'Cypress Park', 'Whytecliff'],
    faqs: [
      { q: 'Do you help with downsizing moves in West Vancouver?', a: 'Yes. We move what you are keeping and place it in your new home, room by room.' },
      { q: 'Why is the travel fee higher in West Vancouver?', a: 'It is a long drive, and the afternoon return over the bridge runs about 70 to 75 minutes in typical traffic. That puts the travel fee at about $190 to $210, confirmed from your addresses before you book.' },
    ],
    nearby: ['north-vancouver', 'vancouver', 'lions-bay'],
    photo: {
      src: '/locations/west-vancouver.jpg',
      alt: 'The Lions Gate Bridge seen from Ambleside Park in West Vancouver',
      credit: commons('GoToVan', 'CC BY 2.0', 'Ambleside_Park,_West_Vancouver_(40198474961).jpg'),
    },
    trips: [
      { area: 'Ambleside & Dundarave', out: 47, back: 74, km: 37 },
      { area: 'British Properties', out: 45, back: 70, km: 36 },
      { area: 'Horseshoe Bay', out: 53, back: 74, km: 47 },
    ],
    access: [
      { title: 'Hillside truck rules', text: 'West Vancouver bars trucks over 11,800 kg from driving downhill on dozens of hillside streets, from Caulfeild to the numbered streets above Marine Drive. Moving trucks like ours are well under that weight; heavier trucks have to use the District\'s permitted access routes.', source: { label: 'District of West Vancouver: Restricted downhill routes for heavy vehicles', href: 'https://www.westvancouver.ca/sites/default/files/media/documents/200326-HeavyVehicleRoutes-cropped.pdf' } },
      { title: 'The drive back is the slow part', text: 'In typical weekday traffic the drive back after a 2 pm finish takes 70 to 75 minutes, against 45 to 55 in the morning. An early start keeps the travel fee down.' },
      { title: 'Steep driveway?', text: 'Many British Properties and Caulfeild driveways are too steep or tight for a truck. If the truck has to stay on the street, tell us the distance to the door so we bring enough hands.' },
    ],
  },
  {
    slug: 'delta',
    name: 'Delta',
    title: 'Delta Movers - North Delta, Ladner & Tsawwassen',
    description: 'Delta movers for North Delta, Ladner and Tsawwassen homes and townhouses. North Delta is about 12 minutes from our truck (travel fee about $45); Ladner and Tsawwassen about $100.',
    keywords: ['Delta BC movers', 'Ladner movers', 'Tsawwassen movers', 'North Delta movers', 'moving company Delta'],
    lead: 'House, townhouse and apartment moves in North Delta, Ladner and Tsawwassen.',
    movingHeading: 'Three Delta Communities, Three Different Drives',
    moving: 'Delta is really three towns. North Delta sits right beside Surrey, about 12 minutes from our truck. Ladner and Tsawwassen are across the farmland to the south, closer to half an hour, and moves from there to Richmond or Vancouver go through the George Massey Tunnel. Delta housing is mostly detached homes and townhouses, which our [residential moving](/residential-moving) page covers; our guide to [how long a house move takes](/guides/how-long-does-it-take-to-move-a-house) helps you plan the day.',
    services: ['residential', 'packing', 'apartment'],
    localTip: { title: 'Ladner or Tsawwassen to Richmond?', text: 'Book a move that heads north through the tunnel in the morning, when it has three northbound lanes.' },
    neighbourhoods: ['North Delta', 'Ladner', 'Tsawwassen', 'Sunshine Hills', 'Annieville', 'Beach Grove', 'Boundary Beach'],
    faqs: [
      { q: 'Do you serve Ladner and Tsawwassen?', a: 'Yes - all three Delta communities: North Delta, Ladner and Tsawwassen.' },
      { q: 'Is a North Delta move cheaper than Tsawwassen?', a: 'The hourly rate is the same; the travel fee differs. North Delta is about $45, Ladner and Tsawwassen about $100 to $105.' },
    ],
    nearby: ['richmond', 'surrey', 'white-rock'],
    photo: {
      src: '/locations/delta.jpg',
      alt: 'Pumpkin field and farm buildings in Ladner, Delta',
      credit: commons('Judy Gallagher', 'CC BY 2.0', 'Pumpkin_Field,_Ladner,_British_Columbia.jpg'),
    },
    trips: [
      { area: 'North Delta', out: 12, back: 14, km: 6 },
      { area: 'Ladner', out: 27, back: 33, km: 25 },
      { area: 'Tsawwassen', out: 28, back: 35, km: 30 },
    ],
    access: [
      { title: 'Massey Tunnel counterflow', text: 'On weekdays the tunnel has three northbound lanes from about 5:45 to 9:30 am and three southbound lanes from about 3 to 6:30 pm (September to June). Moving from Ladner or Tsawwassen to Richmond or Vancouver? A morning start goes with the flow.', source: MASSEY_COUNTERFLOW },
      { title: 'North Delta is next door', text: 'North Delta is about 12 minutes from our truck, so its travel fee is one of the lowest we charge.' },
    ],
  },
  {
    slug: 'langley',
    name: 'Langley',
    title: 'Langley Movers - Willoughby, Walnut Grove, Murrayville & Aldergrove',
    description: 'Movers for the City of Langley and Langley Township: Willoughby townhouses, Walnut Grove and Murrayville homes, and acreages out to Aldergrove. From $130/hr + GST, travel fee about $80 to $140.',
    keywords: ['Langley movers', 'Langley Township movers', 'Willoughby movers', 'Walnut Grove movers', 'Aldergrove movers', 'acreage movers Langley'],
    lead: 'House, townhouse and acreage moves across the City of Langley and Langley Township.',
    movingHeading: 'Langley City or Langley Township?',
    moving: 'Langley is two municipalities: the small City of Langley in the middle, and Langley Township around it, from Walnut Grove and Willoughby to Fort Langley, Brookswood and Aldergrove. That matters for the drive: Walnut Grove is about 25 minutes from our truck, Aldergrove over 40. Willoughby moves are often townhouses with tight visitor parking, while Township acreages can add a shop, a barn or a long gravel driveway. Size the job with [what size moving truck you need](/guides/what-size-moving-truck-do-i-need), and see [long-distance moving](/long-distance-moving) if you are heading further up the Fraser Valley.',
    services: ['residential', 'packing', 'long-distance'],
    localTip: { title: 'Bigger home?', text: 'Our 3-mover crew with the 16\' truck is usually the fastest option for full Langley houses. Tell us the home size when you book.' },
    neighbourhoods: ['Langley City', 'Willoughby', 'Walnut Grove', 'Murrayville', 'Brookswood', 'Fort Langley', 'Aldergrove', 'Willowbrook'],
    faqs: [
      { q: 'Do you serve both Langley City and the Township?', a: 'Yes, including Fort Langley and Aldergrove. They are separate municipalities, so any street permit comes from whichever one you live in.' },
      { q: 'Can you move an acreage with outbuildings?', a: 'Yes. List the shop, garage or barn contents when you book, and send a photo of the driveway if it is gravel or steep, so we bring the right crew and truck space.' },
    ],
    nearby: ['surrey', 'maple-ridge', 'white-rock'],
    photo: {
      src: '/locations/langley.jpg',
      alt: 'The 1932 Fort Langley Community Hall in Langley Township',
      credit: commons('Sunray', 'CC BY-SA 3.0', 'Fort_Langley_Community_Hall.jpg'),
    },
    trips: [
      { area: 'Walnut Grove', out: 24, back: 24, km: 23 },
      { area: 'Langley City', out: 33, back: 36, km: 27 },
      { area: 'Aldergrove', out: 41, back: 44, km: 41 },
    ],
    access: [
      { title: 'Gravel or soft driveway?', text: 'A loaded truck on a soft or steep gravel driveway is a risk to your lawn and our schedule. Send a photo when you book and we will decide together where the truck stops.' },
      { title: 'Further out costs more travel', text: 'The travel fee follows the drive: about $80 for Walnut Grove, $115 for Langley City and $140 for Aldergrove.' },
    ],
  },
  {
    slug: 'port-coquitlam',
    name: 'Port Coquitlam',
    title: 'Port Coquitlam Movers - Citadel Heights, Mary Hill & Downtown PoCo',
    description: 'Port Coquitlam movers for homes, townhouses and condos in Citadel Heights, Mary Hill, Oxford Heights and downtown PoCo. About 25 minutes from our truck; travel fee about $90.',
    keywords: ['Port Coquitlam movers', 'PoCo movers', 'Citadel Heights movers', 'townhouse movers Port Coquitlam'],
    lead: 'Apartment, townhouse and house moves across Port Coquitlam.',
    movingHeading: 'Moving Across PoCo, Over the Tracks',
    moving: 'Port Coquitlam is cut in two by the Coquitlam River and one of the region\'s biggest rail yards, so a move across town often goes over the Coast Meridian overpass or around through downtown. North of the yard, Citadel Heights and Oxford Heights are hillside family homes; downtown and Mary Hill mix condos and townhouses. Houses follow our [residential moving](/residential-moving) process, apartments our [apartment and condo moving](/apartment-moving) one, and our [2 vs 3 movers guide](/guides/2-vs-3-movers) helps you pick the crew.',
    services: ['residential', 'apartment', 'packing'],
    localTip: { title: 'Moving within the Tri-Cities?', text: 'Moves between PoCo, Coquitlam and Port Moody are short drives, so more of your time goes into the move itself.' },
    neighbourhoods: ['Downtown PoCo', 'Citadel Heights', 'Mary Hill', 'Oxford Heights', 'Birchland Manor', 'Riverwood', 'Lincoln Park'],
    faqs: [
      { q: 'Do you serve all of the Tri-Cities?', a: 'Yes - Port Coquitlam, Coquitlam, Port Moody, Anmore and Belcarra.' },
      { q: 'What is the travel fee for a Port Coquitlam move?', a: 'About $90 for a move within PoCo, based on the truck\'s roughly 25-minute drive each way. We confirm it from your addresses before you book.' },
    ],
    nearby: ['coquitlam', 'port-moody', 'pitt-meadows'],
    photo: {
      src: '/locations/port-coquitlam.jpg',
      alt: 'Rail cars in the Canadian Pacific rail yard in Port Coquitlam',
      credit: commons('Roy Luck', 'CC BY 2.0', 'Canadian_Pacific_Railway_yard,_Port_Coquitlam_BC_-_5946480792.jpg'),
    },
    trips: [
      { area: 'Downtown PoCo', out: 25, back: 30, km: 17 },
    ],
    access: [
      { title: 'Blocking part of the street?', text: 'Port Coquitlam regulates any use of a street beyond normal parking under its Highway Use Bylaw. If the truck has to stand in a lane or across a sidewalk, ask the City about a highway use permit first.', source: { label: 'City of Port Coquitlam: Highway Use Bylaw No. 4033', href: 'https://www.portcoquitlam.ca/sites/default/files/2024-10/4033%20-%20Highway%20Use%20Bylaw.pdf' } },
      { title: 'Townhouse visitor parking', text: 'Many PoCo townhouse complexes only allow trucks in visitor stalls or at the entrance. Check your strata rules and tell us how far the truck will be from your door.' },
    ],
  },
  {
    slug: 'port-moody',
    name: 'Port Moody',
    title: 'Port Moody Movers - Suter Brook, Newport Village & Heritage Mountain',
    description: 'Port Moody movers for condos at Suter Brook, Newport Village and Klahanie and hillside homes on Heritage Mountain and College Park. From $130/hr + GST, travel fee about $105.',
    keywords: ['Port Moody movers', 'Suter Brook movers', 'Newport Village movers', 'Heritage Mountain movers', 'condo movers Port Moody'],
    lead: 'Condo, townhouse and house moves around the head of Burrard Inlet in Port Moody.',
    movingHeading: 'Port Moody: Condo Villages and the Mountain',
    moving: 'Port Moody wraps around the end of Burrard Inlet. On the flat, Suter Brook, Newport Village, Klahanie and Inlet Centre are condo villages where each building books its own elevator times. Up the slopes, Heritage Mountain, College Park and Glenayre are split-level houses with steep driveways. Condo moves follow our [apartment and condo moving](/apartment-moving) process and the same steps as our [condo moving checklist](/guides/vancouver-condo-moving-checklist); houses go by [residential moving](/residential-moving).',
    services: ['apartment', 'residential', 'packing'],
    localTip: { title: 'Condo village rules', text: 'Each Suter Brook and Newport Village building sets its own elevator hours - share them when you book and we will fit the schedule.' },
    neighbourhoods: ['Suter Brook', 'Newport Village', 'Inlet Centre', 'Klahanie', 'Heritage Mountain', 'College Park', 'Glenayre', 'Moody Centre', 'Ioco'],
    faqs: [
      { q: 'Do you move condos at Suter Brook and Newport Village?', a: 'Yes, and we work within each building\'s elevator and loading rules.' },
      { q: 'Moving near Ioco or Bedwell Bay Road in summer?', a: 'Expect park traffic from April to September. There is no parking on Bedwell Bay Road near Sasamat Lake, so we plan where the truck stops in advance.' },
    ],
    nearby: ['coquitlam', 'port-coquitlam', 'anmore', 'belcarra'],
    photo: {
      src: '/locations/port-moody.jpg',
      alt: 'Sailboats on Burrard Inlet in Port Moody',
      credit: commons('Kalamazadkhan', 'CC BY-SA 4.0', 'Burrard_Inlet,_Port_Moody,_British_Columbia.jpg'),
    },
    trips: [
      { area: 'Moody Centre & Suter Brook', out: 28, back: 35, km: 17 },
    ],
    access: [
      { title: 'Ask about the strata move-in fee', text: 'A strata move-in or move-out fee has to be set in the building\'s bylaws or ratified rules and be reasonable. Ask your manager for the amount, the deposit and the allowed hours.', source: STRATA_REG },
      { title: 'Summer park traffic toward Ioco', text: 'From spring to fall, Bedwell Bay Road toward Sasamat Lake and Belcarra carries park traffic, with no parking near the lake. Moves out that way go smoother on a weekday or an early start.', source: PARK_TRAFFIC_2021 },
    ],
  },
  {
    slug: 'maple-ridge',
    name: 'Maple Ridge',
    title: 'Maple Ridge Movers - Town Centre, Albion, Silver Valley & Whonnock',
    description: 'Maple Ridge movers for apartments, townhouses, homes and rural lots in Town Centre, Albion, Silver Valley and Whonnock. About 30 minutes from our truck; travel fee about $110.',
    keywords: ['Maple Ridge movers', 'movers Maple Ridge BC', 'Albion movers', 'Silver Valley movers', 'acreage movers Maple Ridge'],
    lead: 'Apartment, townhouse, house and rural moves across Maple Ridge.',
    movingHeading: 'Maple Ridge Is One of Our Regular Runs',
    moving: 'Maple Ridge is about half an hour from our truck. Moves here run from Town Centre apartments and Albion townhouses to Silver Valley homes and rural lots out toward Whonnock and Websters Corners, where garages, sheds and patio sets are part of the load. Houses follow our [residential moving](/residential-moving) process, [what size moving truck you need](/guides/what-size-moving-truck-do-i-need) helps you size the job, and [long-distance moving](/long-distance-moving) covers moves on to Mission, Abbotsford and beyond.',
    services: ['residential', 'packing', 'long-distance'],
    localTip: { title: 'Garage and patio too?', text: 'Let us know about garage shelving, patio sets and other outdoor items when you book so we bring enough truck space.' },
    neighbourhoods: ['Town Centre', 'Albion', 'Cottonwood', 'Silver Valley', 'Hammond', 'Haney', 'Websters Corners', 'Whonnock', 'Thornhill'],
    faqs: [
      { q: 'Do you come out to Maple Ridge?', a: 'Yes, regularly: 3 of our own moves since August 2026 started in Maple Ridge.' },
      { q: 'Are there bridge tolls on a Maple Ridge move?', a: 'No. The Golden Ears and Port Mann bridges have been toll-free since September 2017, so nothing is added to your bill for crossing them.' },
    ],
    nearby: ['pitt-meadows', 'port-coquitlam', 'langley'],
    photo: {
      src: '/locations/maple-ridge.jpg',
      alt: 'Alouette Lake and the mountains above Maple Ridge',
      credit: commons('tamara semina', 'CC BY-SA 3.0', 'Alouette_Lake,_Maple_Ridge,_British_Columbia,_Canada._-_panoramio.jpg'),
    },
    trips: [
      { area: 'Town Centre & Haney', out: 32, back: 34, km: 28 },
    ],
    access: [
      { title: 'Rural lots and long driveways', text: 'Out toward Whonnock and Websters Corners, homes often sit back from the road on gravel. Send a photo of the driveway when you book so we know where the truck can stop.' },
      { title: 'No tolls to pay', text: 'Both the Golden Ears and Port Mann bridges have been toll-free since September 2017.' },
    ],
    ourMoves: '3 of our own moves since August 2026 started in Maple Ridge, including a 1-bedroom move within Maple Ridge in November 2026 with a 2-mover crew.',
  },
  {
    slug: 'pitt-meadows',
    name: 'Pitt Meadows',
    title: 'Pitt Meadows Movers - Central Pitt Meadows, Osprey Village & South Bonson',
    description: 'Pitt Meadows movers for homes, townhouses and condos in Central Pitt Meadows, Osprey Village and South Bonson. About 30 minutes from our truck; travel fee about $95.',
    keywords: ['Pitt Meadows movers', 'movers Pitt Meadows BC', 'Osprey Village movers', 'townhouse movers Pitt Meadows'],
    lead: 'House, townhouse and condo moves in Pitt Meadows.',
    movingHeading: 'Pitt Meadows: Flat Streets, Short Carries',
    moving: 'Pitt Meadows is mostly farmland and dykes, with homes, townhouses and condos clustered around Harris Road, Osprey Village and South Bonson. Flat streets mean short, easy carries; the planning is about strata rules in the newer complexes. Moving next door to Maple Ridge or over the Pitt River Bridge to the Tri-Cities is the same hourly rate. Houses and townhouses follow [residential moving](/residential-moving), Osprey Village condos [apartment and condo moving](/apartment-moving).',
    services: ['residential', 'apartment', 'packing'],
    localTip: { title: 'Paired with Maple Ridge', text: 'Pitt Meadows and Maple Ridge are next door to each other, so a move between them is mostly carrying, not driving.' },
    neighbourhoods: ['Central Pitt Meadows', 'Mid Meadows', 'South Bonson', 'North Lougheed', 'Osprey Village'],
    faqs: [
      { q: 'Do you serve Pitt Meadows?', a: 'Yes. Pitt Meadows is about 30 minutes from our truck, with a travel fee of about $95.' },
      { q: 'Are there tolls on the way?', a: 'No. The Golden Ears Bridge, between Pitt Meadows and Langley, has been toll-free since September 2017.' },
    ],
    nearby: ['maple-ridge', 'port-coquitlam', 'coquitlam'],
    photo: {
      src: '/locations/pitt-meadows.jpg',
      alt: 'Pitt Meadows farmland and the mountains seen from the air',
      credit: commons('Robert Linsdell', 'CC BY 2.0', 'Pitt_Meadows_(504711)_(23892312579).jpg'),
    },
    trips: [
      { area: 'Central Pitt Meadows', out: 28, back: 29, km: 25 },
    ],
    access: [
      { title: 'Newer complexes, stricter rules', text: 'Osprey Village and the newer townhouse complexes set their own move hours and any move-in fee in their bylaws or rules. Ask your strata before you book a time.', source: STRATA_REG },
    ],
  },
  {
    slug: 'white-rock',
    name: 'White Rock',
    title: 'White Rock Movers - East Beach, West Beach & Uptown',
    description: 'White Rock movers for hillside homes, condos and downsizing moves from East and West Beach up to Uptown. About 35 minutes from our truck; travel fee about $115.',
    keywords: ['White Rock movers', 'movers White Rock BC', 'East Beach movers', 'downsizing movers White Rock', 'condo movers White Rock'],
    lead: 'Condo, house and downsizing moves across White Rock, from the beach to Uptown.',
    movingHeading: 'White Rock: Everything Is Uphill From the Beach',
    moving: 'White Rock climbs straight up from Marine Drive, and the streets between the beach and Uptown are some of the steepest in Metro Vancouver: tight turns, houses stepped into the hillside and trucks parked on a slope. Uptown and Five Corners are mostly condos with elevators; the hillside is houses with stairs at the front and back. Downsizing to a condo? See [senior moving](/senior-moving). Condo moves follow [apartment and condo moving](/apartment-moving), and [packing services](/packing-services) can box everything for you.',
    services: ['senior', 'apartment', 'packing'],
    localTip: { title: 'Steep hills', text: 'Many White Rock streets are steep with limited parking. Tell us about stairs and where a truck can stop when you book.' },
    neighbourhoods: ['East Beach', 'West Beach', 'Uptown', 'Hillside', 'Five Corners'],
    faqs: [
      { q: 'Do you help with downsizing moves?', a: 'Yes. We move what you are keeping and set it up in your new home.' },
      { q: 'My street is permit parking only. Where does the truck go?', a: 'White Rock resident permits can be used by residents or their visitors on the block printed on them and the next one. Ask the City whether your permit can cover the truck, or plan for it to stop in your driveway.' },
    ],
    nearby: ['surrey', 'delta', 'langley'],
    photo: {
      src: '/locations/white-rock.jpg',
      alt: 'White Rock\'s hillside homes seen from the White Rock Pier',
      credit: commons('Leoboudv', 'CC BY-SA 3.0', 'White_Rock_Pier_view2.jpg'),
    },
    trips: [
      { area: 'Uptown & the waterfront', out: 31, back: 38, km: 30 },
    ],
    access: [
      { title: 'Permit-parking streets', text: 'Many White Rock streets are posted Permit Parking Only. A resident permit covers its block and the next one, and visitors can use it, but it is not valid in pay parking or time-limited areas.', source: { label: 'City of White Rock: Resident parking', href: 'https://whiterockcity.ca/1144/Resident-Parking' } },
      { title: 'Marine Drive is pay parking', text: 'Marine Drive and its parkades are City pay parking, and they fill up on sunny weekends. For a waterfront move, a weekday or early start makes it easier to stop close.' },
    ],
  },
  {
    slug: 'anmore',
    name: 'Anmore',
    title: 'Anmore Movers - Large-Lot and Acreage Home Moves',
    description: 'Movers for Anmore, BC: large-lot and acreage homes off Sunnyside Road and East Road above Port Moody. About 40 minutes from our truck; travel fee about $130.',
    keywords: ['Anmore movers', 'movers Anmore BC', 'acreage movers Tri-Cities', 'large home movers Anmore'],
    lead: 'House moves on Anmore\'s large lots and acreages, above Port Moody.',
    movingHeading: 'In Anmore, the Plan Matters More Than the Muscle',
    moving: 'Anmore is a rural village above Port Moody, zoned for about one home per acre. Two roads lead in, Sunnyside Road and East Road, and the houses off them are large, with long or steep driveways. That makes the plan matter: where the truck stops, how long the carry is, and which pieces need a dolly on gravel. See [residential moving](/residential-moving) for a full home, [specialty moving](/specialty-moving) for gym equipment, safes and pianos, and [how long a house move takes](/guides/how-long-does-it-take-to-move-a-house) to plan the day.',
    services: ['residential', 'specialty', 'packing'],
    localTip: { title: 'Long driveway?', text: 'Let us know if the truck cannot reach the house - we will plan for the extra carry.' },
    neighbourhoods: ['Anmore Village', 'Sunnyside', 'Eagle Mountain'],
    faqs: [
      { q: 'Do you move homes in Anmore?', a: 'Yes. Send a photo of the driveway when you book so we know where the truck can stop and how long the carry is.' },
      { q: 'Is summer a bad time to move in Anmore?', a: 'Weekends can be slow: Sunnyside Road is also the way into Buntzen Lake. A weekday or early start avoids most of the park traffic.' },
    ],
    nearby: ['port-moody', 'belcarra', 'coquitlam'],
    photo: {
      src: '/locations/anmore.jpg',
      alt: 'Buntzen Lake in the Buntzen Lake Recreation Area, Anmore',
      credit: { author: 'Ben Waardenburg / Wikimedia Commons', license: 'CC0', href: 'https://commons.wikimedia.org/wiki/File:Buntzen_Lake_Recreation_Area,_Anmore,_Canada_(Unsplash_qKmtE3L5-X4).jpg' },
    },
    trips: [
      { area: 'Anmore Village', out: 35, back: 42, km: 24 },
    ],
    access: [
      { title: 'Big lots by design', text: 'Anmore is designated rural, and new lots average about one home per acre. Expect longer carries than in town, and tell us about stairs and the driveway.', source: { label: 'Metro Vancouver: Anmore regional context statement', href: 'https://metrovancouver.org/services/regional-planning/Documents/regional-context-statement-anmore-2019.pdf' } },
      { title: 'Buntzen Lake traffic', text: 'In past summers bylaw officers have managed lineups of park traffic along Sunnyside Road, and Anmore has reduced public parking year round. Summer moves go best on a weekday or early.', source: PARK_TRAFFIC_2021 },
    ],
  },
  {
    slug: 'belcarra',
    name: 'Belcarra',
    title: 'Belcarra Movers - Bedwell Bay and Waterfront Home Moves',
    description: 'Movers for Belcarra, BC: waterfront and forested homes at the end of Bedwell Bay Road. Village-wide permit parking means the truck needs a guest permit. Travel fee about $150.',
    keywords: ['Belcarra movers', 'movers Belcarra BC', 'Bedwell Bay movers', 'waterfront home movers Tri-Cities'],
    lead: 'House moves in the Village of Belcarra, at the end of Bedwell Bay Road.',
    movingHeading: 'Belcarra: One Road In, a Permit for Every Vehicle',
    moving: 'Belcarra is a small village at the end of one winding road, Bedwell Bay Road, with homes tucked into forest and waterfront lots. It is about 45 minutes from our truck each way, past Sasamat Lake and the regional park. Plan for two things: a parking permit for the truck (see below) and the carry, since many driveways are steep or narrow. See [residential moving](/residential-moving) for how a full home is moved, and [packing services](/packing-services) if you want it all boxed before we arrive.',
    services: ['residential', 'packing', 'specialty'],
    localTip: { title: 'Access first', text: 'Send us a photo of your driveway when you book so we can plan where the truck goes.' },
    neighbourhoods: ['Belcarra Village', 'Bedwell Bay', 'Woodhaven'],
    faqs: [
      { q: 'Does the moving truck need a permit in Belcarra?', a: 'Yes. Parking anywhere in the Village needs a resident decal or a guest parking permit, so ask the Village office for a guest permit for the truck before moving day.' },
      { q: 'Do you serve Belcarra?', a: 'Yes, along with nearby Anmore and Port Moody. The travel fee is about $150.' },
    ],
    nearby: ['anmore', 'port-moody'],
    photo: {
      src: '/locations/belcarra.jpg',
      alt: 'View over Indian Arm from the Belcarra lookout',
      credit: commons('The Cosmonaut', 'CC BY-SA 2.5 CA', 'View_from_the_Belcarra_Lookout.jpg'),
    },
    trips: [
      { area: 'Belcarra Village', out: 42, back: 48, km: 30 },
    ],
    access: [
      { title: 'Guest permit for the truck', text: 'All of Belcarra falls under its Parking Regulations Bylaw: a vehicle without a resident decal or guest parking permit can be ticketed or towed, and a few spots are no parking even with a decal. Ask the Village office (604-937-4100) for a guest permit for moving day.', source: { label: 'Village of Belcarra: Parking Regulations Bylaw No. 518 reminder', href: 'https://belcarra.ca/assets/media/2023/06/2023-06-26-REMINDER-Parking-Regulations-Bylaw-No-518-2018.pdf' } },
      { title: 'Summer on Bedwell Bay Road', text: 'From April to the fall there is no parking on Bedwell Bay Road near Sasamat Lake, and the regional park draws heavy traffic on sunny days. Book a weekday or early start for a summer move.', source: PARK_TRAFFIC_2021 },
    ],
  },
  {
    slug: 'lions-bay',
    name: 'Lions Bay',
    title: 'Lions Bay Movers - Hillside Homes off the Sea-to-Sky',
    description: 'Movers for Lions Bay, BC: steep hillside homes off Highway 99 with permit-only street parking. About an hour from our truck; travel fee about $235.',
    keywords: ['Lions Bay movers', 'movers Lions Bay BC', 'Sea-to-Sky movers', 'hillside home movers'],
    lead: 'House moves from hillside homes in Lions Bay, on the Sea-to-Sky Highway.',
    movingHeading: 'Lions Bay: Our Longest Drive, Our Most Careful Plan',
    moving: 'Lions Bay is the far edge of our area: a village of hillside homes off the Sea-to-Sky Highway, about an hour each way from our truck, on steep, winding streets with little room to park. Because the drive is long, its travel fee is the highest of any city we list, and a well-planned day matters even more. Tell us about stairs, the driveway and where a truck can stop, and see [residential moving](/residential-moving) and [specialty moving](/specialty-moving) for heavy pieces.',
    services: ['residential', 'specialty', 'packing'],
    localTip: { title: 'Steep and narrow', text: 'Tell us about stairs and parking when booking - it helps us bring the right crew size.' },
    neighbourhoods: ['Lions Bay Village', 'Brunswick Beach', 'Kelvin Grove'],
    faqs: [
      { q: 'Do you go to Lions Bay?', a: 'Yes. Book a morning start: the drive is about an hour each way, and an early start keeps the day and the travel fee predictable.' },
      { q: 'Where will the truck park?', a: 'Many Lions Bay streets are permit-parking only. Check with the Village office where a moving truck may stand, or plan for your driveway.' },
    ],
    nearby: ['west-vancouver', 'north-vancouver'],
    photo: {
      src: '/locations/lions-bay.jpg',
      alt: 'View across Howe Sound from Lions Bay',
      credit: commons('Michael Nugent', 'CC BY-SA 2.0', 'Across_Howe_Sound_from_Lions_Bay.jpg'),
    },
    trips: [
      { area: 'Lions Bay', out: 62, back: 79, km: 61 },
    ],
    access: [
      { title: 'Permit parking and evacuation routes', text: 'Bylaw officers enforce permit parking on Lions Bay streets, and in dry summers the Village has closed visitor parking and switched pay zones on Mountain Drive and Bayview to No Parking to keep evacuation routes clear, as in August 2023. Ask the Village where a moving truck may stand.', source: { label: 'Village of Lions Bay: Village update, August 2023', href: 'https://www.lionsbay.ca/sites/lionsbay.ca/files/2023-08/230825%20Village%20Update.pdf' } },
      { title: 'Plan for the highway', text: 'The drive back down the Sea-to-Sky after a 2 pm finish takes about 80 minutes in typical traffic, so an early start makes the biggest difference here.' },
    ],
  },
]

export const CITY_BY_SLUG = new Map(CITIES.map(c => [c.slug, c]))

/** Cities rendered by the /locations/[city] template */
export const TEMPLATE_CITIES = CITIES.filter(c => !c.movingHref)

/** City pages are moving pages; Burnaby has its own standalone movers page */
export function cityHref(c: City) {
  return c.movingHref ?? `/locations/${c.slug}`
}

/** Best page for a city when the context is moving */
export function cityMovingHref(c: City) {
  return cityHref(c)
}

/** The city's own local photo (every template city has one) */
export function cityJobPhoto(c: City): CityPhoto | undefined {
  return c.photo
}

export function cityHeroPhoto(c: City): SeoImage {
  return HERO_PHOTOS[CITIES.indexOf(c) % HERO_PHOTOS.length]
}
