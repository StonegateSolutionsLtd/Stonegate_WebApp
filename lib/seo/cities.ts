import type { Faq, SeoImage } from './site'

export interface City {
  slug: string
  name: string
  /** Set for cities that use dedicated standalone pages instead of the template */
  movingHref?: string
  junkHref?: string
  title: string
  description: string
  keywords: string[]
  lead: string
  junk: string
  localTip: { title: string; text: string }
  neighbourhoods: string[]
  faqs: Faq[]
  nearby: string[]
  /** Optional photo for the junk removal section; otherwise picked from the real-job pool */
  image2?: SeoImage
}

/** Real Stonegate job photos, rotated across city pages so they don't all repeat */
const JOB_PHOTOS: { src: string; alt: (city: string) => string; pos?: string }[] = [
  { src: '/truck-bed-loaded.jpg', alt: c => `Stonegate truck loaded during a junk removal job in ${c}` },
  { src: '/junk/residential-junk-removal.jpg', alt: c => `Truck full of household junk removed from a ${c} home`, pos: 'center 62%' },
  { src: '/burnaby/burnaby-junk-truck-loaded.jpg', alt: c => `Stonegate junk removal truck loaded with debris in ${c}` },
  { src: '/junk/household-junk-job.jpg', alt: c => `Stonegate crew loading boxes and household junk in ${c}`, pos: 'center 60%' },
  { src: '/junk/commercial-junk-loading.jpg', alt: c => `Stonegate crew loading pallets during a ${c} cleanout`, pos: 'center 60%' },
  { src: '/junk/garage-cleanout.jpg', alt: c => `Cluttered garage before a junk removal job in ${c}`, pos: 'center 55%' },
  { src: '/junk/commercial-junk-disposal.jpg', alt: c => `Stonegate truck dropping off a junk load from ${c} at the disposal facility`, pos: 'center 55%' },
]

export type SkylineStyle = 'city' | 'suburb' | 'village'

const SKYLINE: Record<string, SkylineStyle> = {
  vancouver: 'city', burnaby: 'city', surrey: 'city', richmond: 'city', coquitlam: 'city',
  'new-westminster': 'city', 'north-vancouver': 'city',
  anmore: 'village', belcarra: 'village', 'lions-bay': 'village',
}

export function citySkyline(c: City): SkylineStyle {
  return SKYLINE[c.slug] ?? 'suburb'
}

export const CITIES: City[] = [
  {
    slug: 'vancouver',
    name: 'Vancouver',
    title: "Vancouver Junk Removal",
    description: "Junk removal in Vancouver, BC. Furniture, mattress and appliance removal, condo cleanouts and same-day junk pickup from Kitsilano to East Van.",
    keywords: ["junk removal Vancouver", "Vancouver junk removal", "same-day junk removal Vancouver", "furniture removal Vancouver", "condo junk removal Vancouver", "junk pickup Vancouver", "rubbish removal Vancouver"],
    lead: "Same-day junk removal across the City of Vancouver - from Downtown condo towers to East Van character homes. We lift, load and haul it all.",
    junk: 'Vancouver junk removal jobs range from a single couch in a West End walk-up to a full Kerrisdale house cleanout before a sale. City bulky-item pickup has limits and wait times; we can usually come same-day or next-day, carry everything out from any floor and send what we can to donation and recycling.',
    localTip: { title: "Junk removal from a Vancouver high-rise?", text: "Many Downtown and Yaletown buildings require a service-elevator booking even for junk pickups. Book the elevator for our 2-hour arrival window and we will handle everything else." },
    neighbourhoods: ['Downtown', 'Yaletown', 'West End', 'Coal Harbour', 'Kitsilano', 'Mount Pleasant', 'Fairview', 'Kerrisdale', 'Dunbar', 'Point Grey', 'Commercial Drive', 'Hastings-Sunrise', 'Marpole', 'Oakridge', 'Killarney', 'Renfrew', 'South Granville', 'UBC'],
    faqs: [
      { q: "Do you remove junk from Downtown Vancouver condos?", a: "Yes. Condo and apartment junk removal is a big part of our Vancouver work. We work with your building on elevator bookings and loading areas." },
      { q: "Is there a parking issue for junk pickup in Vancouver?", a: "On busy streets we may need a short loading spot. If your building has a loading bay, reserve it along with the elevator." },
    ],
    nearby: ['burnaby', 'north-vancouver', 'richmond', 'new-westminster'],
  },
  {
    slug: 'surrey',
    name: 'Surrey',
    title: "Surrey Junk Removal",
    description: "Junk removal in Surrey, BC. Garage cleanouts, furniture and appliance removal, hot tub and yard waste removal in Guildford, Fleetwood, Cloverdale and South Surrey.",
    keywords: ["junk removal Surrey", "Surrey junk removal", "garage cleanout Surrey", "furniture removal Surrey", "hot tub removal Surrey", "junk pickup Surrey BC"],
    lead: "Garage cleanouts, furniture removal and full-property junk removal across Surrey - from Whalley and Guildford to Cloverdale and South Surrey.",
    junk: 'Surrey homes have space - garages, sheds and backyards - and that space fills up. We do a lot of garage cleanouts, shed removals, hot tub removals and yard debris pickups across Surrey, along with everyday furniture and appliance removal.',
    localTip: { title: "Big yard or reno cleanup in Surrey?", text: "Send us photos of soil, sod or broken concrete for a free estimate - often cheaper than renting a bin for a week, and we do the loading." },
    neighbourhoods: ['Whalley', 'City Centre', 'Guildford', 'Fleetwood', 'Newton', 'Cloverdale', 'Fraser Heights', 'Panorama Ridge', 'South Surrey', 'Morgan Creek', 'Grandview Heights', 'Sullivan Heights'],
    faqs: [
      { q: "Do you remove hot tubs in Surrey?", a: "Yes. We cut down and haul hot tubs from Surrey backyards. Drain it and have the power disconnected before we arrive." },
      { q: "Do you cover all of Surrey?", a: "Yes - Whalley, Guildford, Fleetwood, Newton, Cloverdale, South Surrey and everywhere in between." },
    ],
    nearby: ['delta', 'langley', 'white-rock', 'new-westminster'],
  },
  {
    slug: 'burnaby',
    name: 'Burnaby',
    movingHref: '/burnaby-movers',
    junkHref: '/burnaby-junk-removal',
    title: 'Burnaby Junk Removal',
    description: 'Junk removal in Burnaby, BC.',
    keywords: ['Burnaby movers', 'junk removal Burnaby'],
    lead: '',
    junk: '',
    localTip: { title: '', text: '' },
    neighbourhoods: ['Metrotown', 'Brentwood', 'Burnaby Heights', 'Edmonds', 'Lougheed', 'Deer Lake', 'Capitol Hill', 'Burnaby Mountain'],
    faqs: [],
    nearby: ['vancouver', 'new-westminster', 'coquitlam', 'richmond'],
  },
  {
    slug: 'richmond',
    name: 'Richmond',
    title: "Richmond Junk Removal",
    description: "Junk removal in Richmond, BC. Furniture, mattress and appliance removal, condo and townhouse cleanouts in Steveston, Brighouse, Terra Nova and more.",
    keywords: ["junk removal Richmond", "Richmond BC junk removal", "furniture removal Richmond", "appliance removal Richmond", "junk pickup Richmond", "Steveston junk removal"],
    lead: "Furniture, mattress and appliance removal plus full cleanouts across Richmond - from City Centre towers to Steveston and Terra Nova.",
    junk: 'Our Richmond junk removal work includes furniture and mattress removal, appliance pickups during kitchen upgrades, and full house cleanouts before renovations or sales.',
    localTip: { title: "Townhouse complex pickup?", text: "Many Richmond complexes limit where trucks can park. Tell us your unit's location and any strata rules so we can plan the shortest carry." },
    neighbourhoods: ['City Centre', 'Brighouse', 'Steveston', 'Terra Nova', 'Thompson', 'Seafair', 'Broadmoor', 'Ironwood', 'Hamilton', 'East Richmond', 'Blundell', 'Shellmont'],
    faqs: [
      { q: "Do you offer same-day junk removal in Richmond?", a: "Often, yes. Same-day availability depends on the schedule - call or book online to check." },
      { q: "Can you take junk from a Richmond condo storage locker?", a: "Yes. We clear storage lockers, balconies and units in buildings along No. 3 Road and across Richmond." },
    ],
    nearby: ['vancouver', 'delta', 'burnaby', 'new-westminster'],
  },
  {
    slug: 'coquitlam',
    name: 'Coquitlam',
    title: "Coquitlam Junk Removal",
    description: "Junk removal in Coquitlam, BC. Basement and garage cleanouts, furniture and appliance removal on Burke Mountain, Westwood Plateau and across Coquitlam.",
    keywords: ["junk removal Coquitlam", "Coquitlam junk removal", "basement cleanout Coquitlam", "garage cleanout Coquitlam", "furniture removal Coquitlam"],
    lead: "Basement and garage cleanouts, furniture and appliance removal across Coquitlam - from Burquitlam condos to homes on Westwood Plateau and Burke Mountain.",
    junk: 'Coquitlam homes often have finished basements and garages full of storage. We do basement and garage cleanouts, furniture and appliance removal, and yard debris pickups throughout the city.',
    localTip: { title: "Steep driveway or long stair carry?", text: "Let us know when you book - we bring the right equipment and crew so heavy items come out safely." },
    neighbourhoods: ['Burquitlam', 'Coquitlam Centre', 'Westwood Plateau', 'Burke Mountain', 'Maillardville', 'Austin Heights', 'Ranch Park', 'Eagle Ridge', 'Harbour Chines', 'River Springs'],
    faqs: [
      { q: "Do you work on Burke Mountain and Westwood Plateau?", a: "Yes. We regularly haul junk from homes on the steepest streets in both areas." },
    ],
    nearby: ['port-coquitlam', 'port-moody', 'burnaby', 'new-westminster'],
  },
  {
    slug: 'new-westminster',
    name: 'New Westminster',
    title: "New Westminster Junk Removal",
    description: "Junk removal in New Westminster, BC. Apartment cleanouts, furniture removal and renovation debris hauling in Downtown, Sapperton, Queensborough and more.",
    keywords: ["junk removal New Westminster", "New West junk removal", "apartment cleanout New Westminster", "furniture removal New West"],
    lead: "Apartment cleanouts, furniture removal and renovation debris hauling across New Westminster - from Downtown and the Quay to Sapperton and Queensborough.",
    junk: 'New West junk removal jobs include apartment cleanouts, heritage-house renovation debris and furniture removal from walk-ups with no elevator. We carry it all down for you.',
    localTip: { title: "Walk-up apartment?", text: "Many New West buildings have no elevator. Tell us the floor when you book so we bring the right crew - we carry everything down." },
    neighbourhoods: ['Downtown', 'Uptown', 'Sapperton', 'Queens Park', 'Brow of the Hill', 'Queensborough', 'Connaught Heights', 'West End', 'Victory Heights', 'The Quay'],
    faqs: [
      { q: "How quickly can you get to New Westminster?", a: "New West is central to Metro Vancouver, so same-day and next-day pickups are often available. Call to check today's schedule." },
    ],
    nearby: ['burnaby', 'coquitlam', 'surrey', 'richmond'],
  },
  {
    slug: 'north-vancouver',
    name: 'North Vancouver',
    title: "North Vancouver Junk Removal",
    description: "Junk removal in North Vancouver (City and District). Furniture removal, yard waste, deck and fence debris and garage cleanouts from Lonsdale to Lynn Valley.",
    keywords: ["junk removal North Vancouver", "North Van junk removal", "yard waste removal North Vancouver", "Lynn Valley junk removal", "Lonsdale junk removal"],
    lead: "Junk removal across the City and District of North Vancouver - Lonsdale condos to Lynn Valley and Deep Cove homes.",
    junk: 'North Vancouver homes produce a lot of yard waste, deck and fence debris, and garage clutter. We haul all of it, along with furniture, appliances and renovation waste.',
    localTip: { title: "Yard and deck cleanup?", text: "North Shore lots produce a lot of branches, deck boards and fence debris. Combine it all in one pickup to save on a second visit." },
    neighbourhoods: ['Lower Lonsdale', 'Central Lonsdale', 'Lynn Valley', 'Deep Cove', 'Edgemont', 'Capilano', 'Upper Lonsdale', 'Seymour', 'Norgate', 'Lynnmour', 'Blueridge'],
    faqs: [
      { q: "Do you serve both the City and District of North Vancouver?", a: "Yes - from Lower Lonsdale to Deep Cove, Lynn Valley and Edgemont." },
    ],
    nearby: ['west-vancouver', 'vancouver', 'burnaby'],
  },
  {
    slug: 'west-vancouver',
    name: 'West Vancouver',
    title: "West Vancouver Junk Removal",
    description: "Junk removal in West Vancouver, BC. Estate and downsizing cleanouts, furniture removal, hot tub and renovation debris removal in Ambleside, Dundarave and more.",
    keywords: ["junk removal West Vancouver", "West Van junk removal", "estate cleanout West Vancouver", "furniture removal West Vancouver"],
    lead: "Estate cleanouts, downsizing cleanouts and careful furniture removal across West Vancouver.",
    junk: 'We handle estate and downsizing cleanouts, renovation debris, hot tub and deck removals and everyday furniture removal for West Van homeowners.',
    localTip: { title: "Downsizing?", text: "We clear out everything you are not taking - furniture, garage, storage - in one coordinated visit, and donate what we can." },
    neighbourhoods: ['Ambleside', 'Dundarave', 'British Properties', 'Caulfeild', 'Horseshoe Bay', 'Park Royal', 'Cypress Park', 'Whytecliff'],
    faqs: [
      { q: "Do you handle estate cleanouts in West Vancouver?", a: "Yes. We do respectful, donation-first estate cleanouts and can work with executors and realtors." },
    ],
    nearby: ['north-vancouver', 'vancouver'],
  },
  {
    slug: 'delta',
    name: 'Delta',
    title: "Delta Junk Removal",
    description: "Junk removal in Delta, BC - Ladner, Tsawwassen and North Delta. Garage cleanouts, yard waste, shed and furniture removal.",
    keywords: ["junk removal Delta", "Ladner junk removal", "Tsawwassen junk removal", "North Delta junk removal", "garage cleanout Delta"],
    lead: "Garage cleanouts, yard waste and furniture removal across North Delta, Ladner and Tsawwassen.",
    junk: 'Garage cleanouts, yard waste and furniture removal are our most common Delta jobs. We also remove sheds, decks and playsets from bigger lots.',
    localTip: { title: "Ladner or Tsawwassen?", text: "We plan Ladner and Tsawwassen pickups around tunnel traffic so your crew arrives inside the window." },
    neighbourhoods: ['North Delta', 'Ladner', 'Tsawwassen', 'Sunshine Hills', 'Annieville', 'Beach Grove', 'Boundary Beach'],
    faqs: [
      { q: "Do you serve Ladner and Tsawwassen?", a: "Yes - all three Delta communities: North Delta, Ladner and Tsawwassen." },
    ],
    nearby: ['richmond', 'surrey', 'white-rock'],
  },
  {
    slug: 'langley',
    name: 'Langley',
    title: "Langley Junk Removal",
    description: "Junk removal in Langley City and Township - Willoughby, Walnut Grove, Murrayville, Aldergrove. Garage, shed and acreage cleanups.",
    keywords: ["junk removal Langley", "Langley junk removal", "Willoughby junk removal", "Walnut Grove junk removal", "acreage cleanup Langley"],
    lead: "Junk removal across Langley City and Langley Township - from Willoughby townhouses to acreages in Aldergrove.",
    junk: 'Langley junk removal often means bigger loads: garage and shed cleanouts, acreage cleanups, hot tubs, playsets and yard debris.',
    localTip: { title: "Acreage cleanup?", text: "For big outdoor cleanups, send us photos first - we will give you a free estimate before we come out." },
    neighbourhoods: ['Langley City', 'Willoughby', 'Walnut Grove', 'Murrayville', 'Brookswood', 'Fort Langley', 'Aldergrove', 'Willowbrook'],
    faqs: [
      { q: "Do you serve both Langley City and the Township?", a: "Yes, including Fort Langley and Aldergrove." },
    ],
    nearby: ['surrey', 'maple-ridge', 'white-rock'],
  },
  {
    slug: 'port-coquitlam',
    name: 'Port Coquitlam',
    title: "Port Coquitlam Junk Removal",
    description: "Junk removal in Port Coquitlam, BC. Garage and basement cleanouts, furniture, appliance and renovation debris removal across PoCo.",
    keywords: ["junk removal Port Coquitlam", "PoCo junk removal", "garage cleanout Port Coquitlam"],
    lead: "Garage, basement and yard cleanouts plus furniture and appliance removal across Port Coquitlam.",
    junk: 'We clear garages, basements and yards across PoCo, and remove furniture, appliances and renovation debris.',
    localTip: { title: "Tri-Cities pickup?", text: "Jobs across PoCo, Coquitlam and Port Moody are some of our quickest to schedule - same-day is often possible." },
    neighbourhoods: ['Downtown PoCo', 'Citadel Heights', 'Mary Hill', 'Oxford Heights', 'Birchland Manor', 'Riverwood', 'Lincoln Park'],
    faqs: [
      { q: "Do you serve all of the Tri-Cities?", a: "Yes - Port Coquitlam, Coquitlam, Port Moody, Anmore and Belcarra." },
    ],
    nearby: ['coquitlam', 'port-moody', 'pitt-meadows'],
  },
  {
    slug: 'port-moody',
    name: 'Port Moody',
    title: "Port Moody Junk Removal",
    description: "Junk removal in Port Moody, BC. Condo cleanouts at Suter Brook and Newport Village, furniture removal and garage junk removal on Heritage Mountain.",
    keywords: ["junk removal Port Moody", "Port Moody junk removal", "condo cleanout Port Moody"],
    lead: "Condo cleanouts, furniture removal and garage junk removal across Port Moody.",
    junk: 'Furniture removal, condo cleanouts and garage and yard junk removal are the most common Port Moody jobs we do.',
    localTip: { title: "Condo village rules", text: "Suter Brook and Newport Village buildings have strict elevator hours - share them when you book and we will fit the schedule." },
    neighbourhoods: ['Suter Brook', 'Newport Village', 'Inlet Centre', 'Heritage Mountain', 'College Park', 'Glenayre', 'Moody Centre', 'Ioco'],
    faqs: [
      { q: "Do you remove junk from Suter Brook and Newport Village condos?", a: "Yes, and we work within each building's elevator and loading rules." },
    ],
    nearby: ['coquitlam', 'port-coquitlam', 'anmore', 'burnaby'],
  },
  {
    slug: 'maple-ridge',
    name: 'Maple Ridge',
    title: "Maple Ridge Junk Removal",
    description: "Junk removal in Maple Ridge, BC. Acreage cleanups, shed and hot tub removal, garage cleanouts and yard waste removal.",
    keywords: ["junk removal Maple Ridge", "Maple Ridge junk removal", "shed removal Maple Ridge", "yard waste removal Maple Ridge"],
    lead: "Acreage cleanups, shed and hot tub removal and garage cleanouts across Maple Ridge.",
    junk: 'Bigger lots mean bigger cleanouts: sheds, decks, hot tubs, playsets, yard waste and garage junk are all regular Maple Ridge jobs.',
    localTip: { title: "Shed and yard together", text: "Combine shed removal, yard debris and garage junk in one load to save money." },
    neighbourhoods: ['Town Centre', 'Albion', 'Cottonwood', 'Silver Valley', 'Hammond', 'Haney', 'Websters Corners', 'Thornhill'],
    faqs: [
      { q: "Do you come out to Maple Ridge?", a: "Yes. Maple Ridge is part of our regular Metro Vancouver junk removal area." },
    ],
    nearby: ['pitt-meadows', 'port-coquitlam', 'langley'],
  },
  {
    slug: 'pitt-meadows',
    name: 'Pitt Meadows',
    title: "Pitt Meadows Junk Removal",
    description: "Junk removal in Pitt Meadows, BC. Garage cleanouts, yard waste, furniture and appliance removal.",
    keywords: ["junk removal Pitt Meadows", "Pitt Meadows junk removal"],
    lead: "Garage cleanouts, yard waste and furniture removal in Pitt Meadows.",
    junk: 'Garage cleanouts, yard waste, furniture and appliance removal are our most common Pitt Meadows jobs.',
    localTip: { title: "Paired with Maple Ridge", text: "We often schedule Pitt Meadows and Maple Ridge pickups together, which can mean more availability for you." },
    neighbourhoods: ['Central Pitt Meadows', 'Mid Meadows', 'South Bonson', 'North Lougheed', 'Osprey Village'],
    faqs: [
      { q: "Do you serve Pitt Meadows?", a: "Yes, Pitt Meadows is part of our regular junk removal area." },
    ],
    nearby: ['maple-ridge', 'port-coquitlam', 'coquitlam'],
  },
  {
    slug: 'white-rock',
    name: 'White Rock',
    title: "White Rock Junk Removal",
    description: "Junk removal in White Rock, BC. Estate and downsizing cleanouts, furniture removal and condo junk removal near the beach and uptown.",
    keywords: ["junk removal White Rock", "White Rock junk removal", "estate cleanout White Rock"],
    lead: "Estate cleanouts, downsizing cleanouts and furniture removal across White Rock.",
    junk: 'Estate cleanouts, downsizing cleanouts and furniture removal are the most common White Rock jobs we do.',
    localTip: { title: "Steep hills", text: "Many White Rock streets are steep with limited parking. Let us know about access when you book." },
    neighbourhoods: ['East Beach', 'West Beach', 'Uptown', 'Hillside', 'Five Corners'],
    faqs: [
      { q: "Do you help with downsizing cleanouts?", a: "Yes. We clear out what you are not keeping and donate what we can." },
    ],
    nearby: ['surrey', 'delta', 'langley'],
  },
  {
    slug: 'anmore',
    name: 'Anmore',
    title: "Anmore Junk Removal",
    description: "Junk removal in Anmore, BC. Acreage cleanups, yard waste, shed, deck and garage cleanouts in the Village of Anmore.",
    keywords: ["junk removal Anmore", "Anmore junk removal"],
    lead: "Acreage cleanups, yard waste and garage cleanouts in the Village of Anmore.",
    junk: 'Acreage cleanups, yard waste, sheds, decks and garage cleanouts are typical Anmore junk removal jobs.',
    localTip: { title: "Long driveway?", text: "Let us know if the truck cannot reach the house - we will plan for the extra carry." },
    neighbourhoods: ['Anmore Village', 'Sunnyside', 'Eagle Mountain'],
    faqs: [
      { q: "Do you go to Anmore?", a: "Yes. Anmore is part of our Tri-Cities junk removal area." },
    ],
    nearby: ['port-moody', 'belcarra', 'coquitlam'],
  },
  {
    slug: 'belcarra',
    name: 'Belcarra',
    title: "Belcarra Junk Removal",
    description: "Junk removal in Belcarra, BC. Yard waste, deck, furniture and garage junk removal for waterfront and forested properties.",
    keywords: ["junk removal Belcarra", "Belcarra junk removal"],
    lead: "Yard waste, old decks, furniture and garage junk removal in the Village of Belcarra.",
    junk: 'We remove yard waste, old decks, furniture and garage junk from Belcarra properties.',
    localTip: { title: "Access first", text: "Send us a photo of your driveway when you book so we can plan where the truck goes." },
    neighbourhoods: ['Belcarra Village', 'Bedwell Bay', 'Woodhaven'],
    faqs: [
      { q: "Do you serve Belcarra?", a: "Yes, along with nearby Anmore and Port Moody." },
    ],
    nearby: ['anmore', 'port-moody'],
  },
  {
    slug: 'lions-bay',
    name: 'Lions Bay',
    title: "Lions Bay Junk Removal",
    description: "Junk removal in Lions Bay, BC. Furniture, renovation debris, deck boards and yard waste hauled from hillside homes.",
    keywords: ["junk removal Lions Bay", "Lions Bay junk removal"],
    lead: "Furniture, renovation debris and yard waste removal from hillside homes in Lions Bay.",
    junk: 'We haul furniture, renovation debris, deck boards and yard waste from Lions Bay properties.',
    localTip: { title: "Steep and narrow", text: "Tell us about stairs and parking when booking - it helps us bring the right crew size." },
    neighbourhoods: ['Lions Bay Village', 'Brunswick Beach', 'Kelvin Grove'],
    faqs: [
      { q: "Do you go to Lions Bay?", a: "Yes. We serve Lions Bay together with our West Vancouver pickups." },
    ],
    nearby: ['west-vancouver', 'north-vancouver'],
  },
]

export const CITY_BY_SLUG = new Map(CITIES.map(c => [c.slug, c]))

/** Cities rendered by the /locations/[city] template */
export const TEMPLATE_CITIES = CITIES.filter(c => !c.movingHref)

export function cityHref(c: City) {
  return c.junkHref ?? `/locations/${c.slug}`
}

/** Best page for a city when the context is junk removal */
export function cityJunkHref(c: City) {
  return c.junkHref ?? `/locations/${c.slug}`
}

/** Best page for a city when the context is moving */
export function cityMovingHref(c: City) {
  return c.movingHref ?? `/locations/${c.slug}`
}

export function cityJobPhoto(c: City): SeoImage {
  if (c.image2) return c.image2
  const i = CITIES.indexOf(c) % JOB_PHOTOS.length
  const p = JOB_PHOTOS[i]
  return { src: p.src, alt: p.alt(c.name), pos: p.pos }
}
