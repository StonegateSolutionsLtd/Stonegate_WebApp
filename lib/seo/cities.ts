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
  moving: string
  localTip: { title: string; text: string }
  neighbourhoods: string[]
  faqs: Faq[]
  nearby: string[]
  /** Optional photo for the moving section; otherwise picked from the real-job pool */
  image2?: SeoImage
}

/** Real Stonegate moving job photos, rotated across city pages so they don't all repeat */
const JOB_PHOTOS: { src: string; alt: (city: string) => string; pos?: string }[] = [
  { src: '/crew-wrapping-furniture.jpg', alt: c => `Stonegate movers wrapping furniture during a move in ${c}`, pos: 'center 45%' },
  { src: '/burnaby/burnaby-move-apartment-boxes.jpg', alt: c => `Stonegate mover carrying wrapped furniture up the truck ramp in ${c}` },
  { src: '/burnaby/burnaby-move-truck-loaded.jpg', alt: c => `Stonegate moving truck packed with boxes and furniture in ${c}` },
  { src: '/burnaby/burnaby-move-crew-loading.jpg', alt: c => `Stonegate crew loading the moving truck in ${c}`, pos: 'center 45%' },
  { src: '/burnaby/burnaby-move-truck-street.jpg', alt: c => `Stonegate moving truck loaded with wrapped furniture on a ${c} street` },
  { src: '/about/photo-4.jpg', alt: c => `Stonegate movers loading boxes into the truck in ${c}` },
  { src: '/crew-loading-ramp.jpg', alt: c => `Stonegate mover loading the truck ramp on moving day in ${c}`, pos: 'center 40%' },
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
    title: 'Vancouver Movers',
    description: 'Local movers in Vancouver, BC. Apartment, condo and house moves from Downtown and the West End to Kitsilano and East Van. 2 movers and a truck from $120/hr + GST.',
    keywords: ['movers Vancouver', 'Vancouver movers', 'moving company Vancouver', 'apartment movers Vancouver', 'condo movers Vancouver', 'local movers Vancouver'],
    lead: 'Apartment, condo and house moves across the City of Vancouver - from Downtown towers to East Van character homes. We wrap, load, move and set up.',
    moving: 'Vancouver moves range from a studio in a West End walk-up to a full Kerrisdale family home. We wrap furniture in blankets, take apart what needs it, protect hallways and elevators, and reassemble everything in your new place - whether you are moving across the street or across Metro Vancouver.',
    localTip: { title: 'Moving in or out of a Vancouver high-rise?', text: 'Most Downtown and Yaletown buildings need a move-in or move-out elevator booking and a loading bay reservation. Book both for your moving window and we will handle everything else.' },
    neighbourhoods: ['Downtown', 'Yaletown', 'West End', 'Coal Harbour', 'Kitsilano', 'Mount Pleasant', 'Fairview', 'Kerrisdale', 'Dunbar', 'Point Grey', 'Commercial Drive', 'Hastings-Sunrise', 'Marpole', 'Oakridge', 'Killarney', 'Renfrew', 'South Granville', 'UBC'],
    faqs: [
      { q: 'Do you move people in and out of Downtown Vancouver condos?', a: 'Yes. Condo moves are a big part of our Vancouver work. We work around your building\'s elevator booking and loading bay rules.' },
      { q: 'What about parking for the moving truck in Vancouver?', a: 'On busy streets we need a spot close to the entrance. If your building has a loading bay, reserve it along with the elevator - it keeps the carry short and the move faster.' },
    ],
    nearby: ['burnaby', 'north-vancouver', 'richmond', 'new-westminster'],
  },
  {
    slug: 'surrey',
    name: 'Surrey',
    title: 'Surrey Movers',
    description: 'Local movers in Surrey, BC. House, townhouse and apartment moves in Guildford, Fleetwood, Newton, Cloverdale and South Surrey. 2 movers and a truck from $120/hr + GST.',
    keywords: ['movers Surrey', 'Surrey movers', 'moving company Surrey', 'house movers Surrey', 'local movers Surrey BC'],
    lead: 'House, townhouse and apartment moves across Surrey - from Whalley and Guildford to Cloverdale and South Surrey.',
    moving: 'Surrey moves are often bigger homes with full garages, so we plan the crew and truck to match. We wrap and protect furniture, handle heavy pieces like dressers, sectionals and appliances, and load the truck so everything arrives in the same condition it left.',
    localTip: { title: 'Moving a full house in Surrey?', text: 'For a 3+ bedroom home, our 3-mover crew with the 16\' truck usually saves time overall. Tell us the size of your home when you book and we will suggest the right crew.' },
    neighbourhoods: ['Whalley', 'City Centre', 'Guildford', 'Fleetwood', 'Newton', 'Cloverdale', 'Fraser Heights', 'Panorama Ridge', 'South Surrey', 'Morgan Creek', 'Grandview Heights', 'Sullivan Heights'],
    faqs: [
      { q: 'Do you move houses as well as apartments in Surrey?', a: 'Yes - from one-bedroom apartments to full family homes. For larger homes we recommend our 3-mover crew with a 16\' truck.' },
      { q: 'Do you cover all of Surrey?', a: 'Yes - Whalley, Guildford, Fleetwood, Newton, Cloverdale, South Surrey and everywhere in between.' },
    ],
    nearby: ['delta', 'langley', 'white-rock', 'new-westminster'],
  },
  {
    slug: 'burnaby',
    name: 'Burnaby',
    movingHref: '/burnaby-movers',
    junkHref: '/burnaby-junk-removal',
    title: 'Burnaby Movers',
    description: 'Movers in Burnaby, BC.',
    keywords: ['Burnaby movers'],
    lead: '',
    moving: '',
    localTip: { title: '', text: '' },
    neighbourhoods: ['Metrotown', 'Brentwood', 'Burnaby Heights', 'Edmonds', 'Lougheed', 'Deer Lake', 'Capitol Hill', 'Burnaby Mountain'],
    faqs: [],
    nearby: ['vancouver', 'new-westminster', 'coquitlam', 'richmond'],
  },
  {
    slug: 'richmond',
    name: 'Richmond',
    title: 'Richmond Movers',
    description: 'Local movers in Richmond, BC. Condo, townhouse and house moves in City Centre, Steveston, Terra Nova and across Richmond. 2 movers and a truck from $120/hr + GST.',
    keywords: ['movers Richmond', 'Richmond BC movers', 'moving company Richmond', 'condo movers Richmond', 'Steveston movers'],
    lead: 'Condo, townhouse and house moves across Richmond - from City Centre towers to Steveston and Terra Nova.',
    moving: 'Our Richmond moves include condos along No. 3 Road, townhouse complexes with tight parking and family homes across the city. We plan the carry, protect your floors and furniture and keep the move moving.',
    localTip: { title: 'Moving from a townhouse complex?', text: 'Many Richmond complexes limit where trucks can park. Tell us your unit\'s location and any strata rules so we can plan the shortest carry.' },
    neighbourhoods: ['City Centre', 'Brighouse', 'Steveston', 'Terra Nova', 'Thompson', 'Seafair', 'Broadmoor', 'Ironwood', 'Hamilton', 'East Richmond', 'Blundell', 'Shellmont'],
    faqs: [
      { q: 'Do you move condos in Richmond City Centre?', a: 'Yes. We work within each building\'s elevator booking and loading rules along No. 3 Road and across Richmond.' },
      { q: 'Can you move us from Richmond to another city?', a: 'Yes. We move people anywhere in Metro Vancouver, and can plan longer moves on request.' },
    ],
    nearby: ['vancouver', 'delta', 'burnaby', 'new-westminster'],
  },
  {
    slug: 'coquitlam',
    name: 'Coquitlam',
    title: 'Coquitlam Movers',
    description: 'Local movers in Coquitlam, BC. Apartment and house moves in Burquitlam, Coquitlam Centre, Westwood Plateau and Burke Mountain. 2 movers and a truck from $120/hr + GST.',
    keywords: ['movers Coquitlam', 'Coquitlam movers', 'moving company Coquitlam', 'Burke Mountain movers', 'local movers Coquitlam'],
    lead: 'Apartment and house moves across Coquitlam - from Burquitlam condos to homes on Westwood Plateau and Burke Mountain.',
    moving: 'Coquitlam moves often mean hillside homes, long driveways and multi-level houses. We bring the crew and equipment to move heavy furniture safely up and down stairs, and we handle condo moves near the Evergreen Line just as often.',
    localTip: { title: 'Steep driveway or lots of stairs?', text: 'Let us know when you book - we bring the right crew size so heavy pieces come out safely and the move stays on schedule.' },
    neighbourhoods: ['Burquitlam', 'Coquitlam Centre', 'Westwood Plateau', 'Burke Mountain', 'Maillardville', 'Austin Heights', 'Ranch Park', 'Eagle Ridge', 'Harbour Chines', 'River Springs'],
    faqs: [
      { q: 'Do you move homes on Burke Mountain and Westwood Plateau?', a: 'Yes. We regularly move homes on the steepest streets in both areas.' },
    ],
    nearby: ['port-coquitlam', 'port-moody', 'burnaby', 'new-westminster'],
  },
  {
    slug: 'new-westminster',
    name: 'New Westminster',
    title: 'New Westminster Movers',
    description: 'Local movers in New Westminster, BC. Apartment, walk-up and heritage house moves in Downtown, Sapperton, Queens Park and Queensborough. 2 movers and a truck from $120/hr + GST.',
    keywords: ['movers New Westminster', 'New West movers', 'moving company New Westminster', 'apartment movers New Westminster'],
    lead: 'Apartment, walk-up and heritage house moves across New Westminster - from Downtown and the Quay to Sapperton and Queensborough.',
    moving: 'New West has plenty of walk-up apartments and older homes with narrow staircases. We take apart what will not fit, carry it all down safely and put it back together at your new place.',
    localTip: { title: 'Walk-up apartment?', text: 'Many New West buildings have no elevator. Tell us the floor when you book so we bring the right crew for the stairs.' },
    neighbourhoods: ['Downtown', 'Uptown', 'Sapperton', 'Queens Park', 'Brow of the Hill', 'Queensborough', 'Connaught Heights', 'West End', 'Victory Heights', 'The Quay'],
    faqs: [
      { q: 'Can you move us out of a walk-up with no elevator?', a: 'Yes. Stairs are part of most New West moves - just tell us the floor when you book.' },
    ],
    nearby: ['burnaby', 'coquitlam', 'surrey', 'richmond'],
  },
  {
    slug: 'north-vancouver',
    name: 'North Vancouver',
    title: 'North Vancouver Movers',
    description: 'Local movers in North Vancouver (City and District). Condo and house moves from Lonsdale to Lynn Valley, Edgemont and Deep Cove. 2 movers and a truck from $120/hr + GST.',
    keywords: ['movers North Vancouver', 'North Van movers', 'moving company North Vancouver', 'Lonsdale movers', 'Lynn Valley movers'],
    lead: 'Condo and house moves across the City and District of North Vancouver - Lonsdale towers to Lynn Valley and Deep Cove homes.',
    moving: 'North Shore moves mean hillside homes, long stair runs and bridge traffic. We plan the route and timing so your crew arrives inside the window, and we protect your furniture on every step.',
    localTip: { title: 'Crossing the bridge?', text: 'For moves to or from the North Shore, we plan around bridge traffic so the move stays on schedule.' },
    neighbourhoods: ['Lower Lonsdale', 'Central Lonsdale', 'Lynn Valley', 'Deep Cove', 'Edgemont', 'Capilano', 'Upper Lonsdale', 'Seymour', 'Norgate', 'Lynnmour', 'Blueridge'],
    faqs: [
      { q: 'Do you serve both the City and District of North Vancouver?', a: 'Yes - from Lower Lonsdale to Deep Cove, Lynn Valley and Edgemont.' },
    ],
    nearby: ['west-vancouver', 'vancouver', 'burnaby'],
  },
  {
    slug: 'west-vancouver',
    name: 'West Vancouver',
    title: 'West Vancouver Movers',
    description: 'Local movers in West Vancouver, BC. Careful house and condo moves in Ambleside, Dundarave, British Properties and more. 2 movers and a truck from $120/hr + GST.',
    keywords: ['movers West Vancouver', 'West Van movers', 'moving company West Vancouver', 'downsizing movers West Vancouver'],
    lead: 'Careful house, condo and downsizing moves across West Vancouver.',
    moving: 'West Vancouver moves often include fine furniture, art and long driveways. We wrap every piece in blankets, protect floors and doorways, and place everything where you want it in your new home.',
    localTip: { title: 'Downsizing?', text: 'Moving to a smaller home? Tell us which pieces are coming with you and we will plan the crew and truck around just those.' },
    neighbourhoods: ['Ambleside', 'Dundarave', 'British Properties', 'Caulfeild', 'Horseshoe Bay', 'Park Royal', 'Cypress Park', 'Whytecliff'],
    faqs: [
      { q: 'Do you help with downsizing moves in West Vancouver?', a: 'Yes. We move what you are keeping and place it in your new home, room by room.' },
    ],
    nearby: ['north-vancouver', 'vancouver'],
  },
  {
    slug: 'delta',
    name: 'Delta',
    title: 'Delta Movers',
    description: 'Local movers in Delta, BC - Ladner, Tsawwassen and North Delta. House, townhouse and apartment moves. 2 movers and a truck from $120/hr + GST.',
    keywords: ['movers Delta', 'Ladner movers', 'Tsawwassen movers', 'North Delta movers', 'moving company Delta BC'],
    lead: 'House, townhouse and apartment moves across North Delta, Ladner and Tsawwassen.',
    moving: 'Most of our Delta moves are family homes and townhouses. We wrap and load your furniture, handle the heavy pieces and set everything up at your new place.',
    localTip: { title: 'Ladner or Tsawwassen?', text: 'We plan Ladner and Tsawwassen moves around tunnel traffic so your crew arrives inside the window.' },
    neighbourhoods: ['North Delta', 'Ladner', 'Tsawwassen', 'Sunshine Hills', 'Annieville', 'Beach Grove', 'Boundary Beach'],
    faqs: [
      { q: 'Do you serve Ladner and Tsawwassen?', a: 'Yes - all three Delta communities: North Delta, Ladner and Tsawwassen.' },
    ],
    nearby: ['richmond', 'surrey', 'white-rock'],
  },
  {
    slug: 'langley',
    name: 'Langley',
    title: 'Langley Movers',
    description: 'Local movers in Langley City and Township - Willoughby, Walnut Grove, Murrayville and Aldergrove. House and townhouse moves from $120/hr + GST.',
    keywords: ['movers Langley', 'Langley movers', 'moving company Langley', 'Willoughby movers', 'Walnut Grove movers'],
    lead: 'House and townhouse moves across Langley City and Langley Township - from Willoughby townhouses to homes in Aldergrove.',
    moving: 'Langley moves are often full family homes, so we plan the crew and truck size to match. We wrap, load and set up your furniture so moving day is one trip, not three.',
    localTip: { title: 'Bigger home?', text: 'Our 3-mover crew with the 16\' truck is usually the fastest option for full Langley houses. Tell us the home size when you book.' },
    neighbourhoods: ['Langley City', 'Willoughby', 'Walnut Grove', 'Murrayville', 'Brookswood', 'Fort Langley', 'Aldergrove', 'Willowbrook'],
    faqs: [
      { q: 'Do you serve both Langley City and the Township?', a: 'Yes, including Fort Langley and Aldergrove.' },
    ],
    nearby: ['surrey', 'maple-ridge', 'white-rock'],
  },
  {
    slug: 'port-coquitlam',
    name: 'Port Coquitlam',
    title: 'Port Coquitlam Movers',
    description: 'Local movers in Port Coquitlam, BC. Apartment, townhouse and house moves across PoCo. 2 movers and a truck from $120/hr + GST.',
    keywords: ['movers Port Coquitlam', 'PoCo movers', 'moving company Port Coquitlam'],
    lead: 'Apartment, townhouse and house moves across Port Coquitlam.',
    moving: 'We move PoCo families between apartments, townhouses and houses - wrapping furniture, handling the heavy lifting and setting everything up in the new place.',
    localTip: { title: 'Moving within the Tri-Cities?', text: 'Moves between PoCo, Coquitlam and Port Moody are short drives, so more of your time goes into the move itself.' },
    neighbourhoods: ['Downtown PoCo', 'Citadel Heights', 'Mary Hill', 'Oxford Heights', 'Birchland Manor', 'Riverwood', 'Lincoln Park'],
    faqs: [
      { q: 'Do you serve all of the Tri-Cities?', a: 'Yes - Port Coquitlam, Coquitlam, Port Moody, Anmore and Belcarra.' },
    ],
    nearby: ['coquitlam', 'port-moody', 'pitt-meadows'],
  },
  {
    slug: 'port-moody',
    name: 'Port Moody',
    title: 'Port Moody Movers',
    description: 'Local movers in Port Moody, BC. Condo moves at Suter Brook and Newport Village and house moves on Heritage Mountain. 2 movers and a truck from $120/hr + GST.',
    keywords: ['movers Port Moody', 'Port Moody movers', 'condo movers Port Moody'],
    lead: 'Condo, townhouse and house moves across Port Moody.',
    moving: 'Port Moody moves are a mix of condo villages with strict move-in rules and hillside homes on Heritage Mountain. We plan around both.',
    localTip: { title: 'Condo village rules', text: 'Suter Brook and Newport Village buildings have strict elevator hours - share them when you book and we will fit the schedule.' },
    neighbourhoods: ['Suter Brook', 'Newport Village', 'Inlet Centre', 'Heritage Mountain', 'College Park', 'Glenayre', 'Moody Centre', 'Ioco'],
    faqs: [
      { q: 'Do you move condos at Suter Brook and Newport Village?', a: 'Yes, and we work within each building\'s elevator and loading rules.' },
    ],
    nearby: ['coquitlam', 'port-coquitlam', 'anmore', 'burnaby'],
  },
  {
    slug: 'maple-ridge',
    name: 'Maple Ridge',
    title: 'Maple Ridge Movers',
    description: 'Local movers in Maple Ridge, BC. House and townhouse moves in Town Centre, Albion, Cottonwood and Silver Valley. 2 movers and a truck from $120/hr + GST.',
    keywords: ['movers Maple Ridge', 'Maple Ridge movers', 'moving company Maple Ridge'],
    lead: 'House and townhouse moves across Maple Ridge.',
    moving: 'Most Maple Ridge moves are family homes with garages and outdoor furniture. We plan the crew and truck to get it all in one trip.',
    localTip: { title: 'Garage and patio too?', text: 'Let us know about garage shelving, patio sets and other outdoor items when you book so we bring enough truck space.' },
    neighbourhoods: ['Town Centre', 'Albion', 'Cottonwood', 'Silver Valley', 'Hammond', 'Haney', 'Websters Corners', 'Thornhill'],
    faqs: [
      { q: 'Do you come out to Maple Ridge?', a: 'Yes. Maple Ridge is part of our regular Metro Vancouver moving area.' },
    ],
    nearby: ['pitt-meadows', 'port-coquitlam', 'langley'],
  },
  {
    slug: 'pitt-meadows',
    name: 'Pitt Meadows',
    title: 'Pitt Meadows Movers',
    description: 'Local movers in Pitt Meadows, BC. House, townhouse and apartment moves. 2 movers and a truck from $120/hr + GST.',
    keywords: ['movers Pitt Meadows', 'Pitt Meadows movers'],
    lead: 'House, townhouse and apartment moves in Pitt Meadows.',
    moving: 'We move Pitt Meadows homes and townhouses - wrapping furniture, handling the heavy lifting and setting everything up in your new place.',
    localTip: { title: 'Paired with Maple Ridge', text: 'We often schedule Pitt Meadows and Maple Ridge moves together, which can mean more availability for you.' },
    neighbourhoods: ['Central Pitt Meadows', 'Mid Meadows', 'South Bonson', 'North Lougheed', 'Osprey Village'],
    faqs: [
      { q: 'Do you serve Pitt Meadows?', a: 'Yes, Pitt Meadows is part of our regular moving area.' },
    ],
    nearby: ['maple-ridge', 'port-coquitlam', 'coquitlam'],
  },
  {
    slug: 'white-rock',
    name: 'White Rock',
    title: 'White Rock Movers',
    description: 'Local movers in White Rock, BC. Condo, house and downsizing moves near the beach and uptown. 2 movers and a truck from $120/hr + GST.',
    keywords: ['movers White Rock', 'White Rock movers', 'downsizing movers White Rock'],
    lead: 'Condo, house and downsizing moves across White Rock.',
    moving: 'Condo and downsizing moves are the most common White Rock jobs we do. We move what you are keeping, protect it on the way and place it room by room.',
    localTip: { title: 'Steep hills', text: 'Many White Rock streets are steep with limited parking. Let us know about access when you book.' },
    neighbourhoods: ['East Beach', 'West Beach', 'Uptown', 'Hillside', 'Five Corners'],
    faqs: [
      { q: 'Do you help with downsizing moves?', a: 'Yes. We move what you are keeping and set it up in your new home.' },
    ],
    nearby: ['surrey', 'delta', 'langley'],
  },
  {
    slug: 'anmore',
    name: 'Anmore',
    title: 'Anmore Movers',
    description: 'Local movers in Anmore, BC. House moves for acreages and homes with long driveways in the Village of Anmore.',
    keywords: ['movers Anmore', 'Anmore movers'],
    lead: 'House moves in the Village of Anmore.',
    moving: 'Anmore homes are often on large lots with long driveways. We plan the truck position and the carry before moving day so nothing slows the move down.',
    localTip: { title: 'Long driveway?', text: 'Let us know if the truck cannot reach the house - we will plan for the extra carry.' },
    neighbourhoods: ['Anmore Village', 'Sunnyside', 'Eagle Mountain'],
    faqs: [
      { q: 'Do you move homes in Anmore?', a: 'Yes. Anmore is part of our Tri-Cities moving area.' },
    ],
    nearby: ['port-moody', 'belcarra', 'coquitlam'],
  },
  {
    slug: 'belcarra',
    name: 'Belcarra',
    title: 'Belcarra Movers',
    description: 'Local movers in Belcarra, BC. House moves for waterfront and forested properties.',
    keywords: ['movers Belcarra', 'Belcarra movers'],
    lead: 'House moves in the Village of Belcarra.',
    moving: 'Belcarra properties often have narrow roads and tricky access. We plan where the truck goes ahead of time so moving day runs smoothly.',
    localTip: { title: 'Access first', text: 'Send us a photo of your driveway when you book so we can plan where the truck goes.' },
    neighbourhoods: ['Belcarra Village', 'Bedwell Bay', 'Woodhaven'],
    faqs: [
      { q: 'Do you serve Belcarra?', a: 'Yes, along with nearby Anmore and Port Moody.' },
    ],
    nearby: ['anmore', 'port-moody'],
  },
  {
    slug: 'lions-bay',
    name: 'Lions Bay',
    title: 'Lions Bay Movers',
    description: 'Local movers in Lions Bay, BC. House moves from hillside homes with stairs and limited parking.',
    keywords: ['movers Lions Bay', 'Lions Bay movers'],
    lead: 'House moves from hillside homes in Lions Bay.',
    moving: 'Lions Bay homes are steep, with long stair runs and limited parking. We bring the crew size the job needs and plan the carry before we arrive.',
    localTip: { title: 'Steep and narrow', text: 'Tell us about stairs and parking when booking - it helps us bring the right crew size.' },
    neighbourhoods: ['Lions Bay Village', 'Brunswick Beach', 'Kelvin Grove'],
    faqs: [
      { q: 'Do you go to Lions Bay?', a: 'Yes. We serve Lions Bay together with our West Vancouver moves.' },
    ],
    nearby: ['west-vancouver', 'north-vancouver'],
  },
]

export const CITY_BY_SLUG = new Map(CITIES.map(c => [c.slug, c]))

/** Cities rendered by the /locations/[city] template */
export const TEMPLATE_CITIES = CITIES.filter(c => !c.movingHref)

/** City pages are moving pages; Burnaby has its own standalone movers page */
export function cityHref(c: City) {
  return c.movingHref ?? `/locations/${c.slug}`
}

/** Best page for a city when the context is junk removal */
export function cityJunkHref(c: City) {
  return c.junkHref ?? `/locations/${c.slug}`
}

/** Best page for a city when the context is moving */
export function cityMovingHref(c: City) {
  return cityHref(c)
}

export function cityJobPhoto(c: City): SeoImage {
  if (c.image2) return c.image2
  const i = CITIES.indexOf(c) % JOB_PHOTOS.length
  const p = JOB_PHOTOS[i]
  return { src: p.src, alt: p.alt(c.name), pos: p.pos }
}
