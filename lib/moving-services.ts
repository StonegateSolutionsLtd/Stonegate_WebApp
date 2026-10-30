export interface ServicePhoto {
  src: string
  alt: string
  /** CSS object-position */
  pos?: string
  /** CSS brightness() for photos taken in low light, e.g. 1.4 */
  brightness?: number
}

export interface MovingService {
  slug: 'local' | 'residential' | 'commercial' | 'packing'
  path: string
  /** Short name used in links and the services list */
  name: string
  metaTitle: string
  metaDescription: string
  /** Hero headline: white line, then the orange line under the 'Metro Vancouver' divider */
  heading: [string, string]
  heroPhoto: ServicePhoto
  intro: string
  /** Card shown wherever the moving services are listed (homepage, other service pages) */
  cardText: string
  cardPhoto: ServicePhoto
  includedHeading: string
  included: { id?: string; title: string; text: string }[]
  /** Each step shows a photo, or a round illustration on white */
  steps: { verb: string; text: string; photo?: ServicePhoto; illustration?: ServicePhoto }[]
  priceNote: string
  faqHeading: string
  faqs: { q: string; a: string }[]
  listPhoto: ServicePhoto
}

export const RATE_TEXT = '3-hour minimum. A one-time flat travel fee, explained before you book. Prices plus GST.'

const PRICE_FAQ = {
  q: 'How is the price worked out?',
  a: 'By the hour: $130 for 2 movers and a truck, or $170 for 3 movers with the 16\' truck, plus GST. There is a 3-hour minimum and a one-time flat travel fee we explain before you book.',
}

const INCLUDED_FAQ = {
  q: 'What comes with the crew?',
  a: 'The truck, moving blankets, straps, dollies and a ramp. Furniture is wrapped before it leaves the room, and anything that needs taking apart is put back together at the other end.',
}

export const MOVING_SERVICES: MovingService[] = [
  {
    slug: 'local',
    path: '/moving',
    name: 'Local moving',
    metaTitle: 'Local Movers in Metro Vancouver | Stonegate Moving Solutions',
    metaDescription: 'Local moving across Metro Vancouver: apartments, condos and houses. 2 movers and a truck from $130/hr + GST. Check availability and book online.',
    heading: ['Local', 'Movers'],
    cardPhoto: { src: '/burnaby/burnaby-move-apartment-boxes.jpg', alt: 'A Stonegate mover carrying wrapped furniture up the ramp into the truck', pos: 'center 40%' },
    cardText: 'Apartments, condos and houses moved anywhere in Metro Vancouver.',
    includedHeading: 'Any home, any building',
    heroPhoto: { src: '/hero-left.jpg', alt: 'The Stonegate moving truck on a tree-lined road in Metro Vancouver', pos: 'center 55%', brightness: 1.45 },
    intro: 'Apartments, condos and houses, anywhere in Metro Vancouver. Tell us where from and where to.',
    included: [
      { id: 'apartment-moving', title: 'Condos and walk-ups', text: 'Elevator bookings, loading bays, fourth-floor walk-ups. Tell us the building rules and we work inside them.' },
      { title: 'Houses and townhouses', text: 'Family homes moved room by room: furniture taken apart, wrapped, carried out and set up again.' },
      { id: 'long-distance-moving', title: 'Past the region', text: 'Moving outside Metro Vancouver? Send us the route and the dates and we will confirm the move with you.' },
    ],
    steps: [
      { verb: 'Wrap', text: 'Every piece goes into blankets before it leaves the room.', photo: { src: '/moving/protect-wrapped-furniture.png', alt: 'A Stonegate mover wrapping furniture in a moving blanket inside the home', pos: 'center 55%' } },
      { verb: 'Load', text: 'Up the ramp, strapped to the wall, packed tight so nothing shifts.', photo: { src: '/burnaby/burnaby-move-apartment-boxes.jpg', alt: 'A Stonegate mover carrying wrapped furniture up the ramp into the truck', pos: 'center 45%' } },
      { verb: 'Drive', text: 'One trip across the city, planned around bridges and traffic.', photo: { src: '/junk/crew-4557-truck-side.jpg', alt: 'A Stonegate mover loading the back of the branded truck', pos: 'center 60%' } },
      { verb: 'Unload', text: 'Carried to the room you want it in and put back together.', photo: { src: '/crew-loading-ramp.jpg', alt: 'A Stonegate mover sliding out the truck ramp', pos: 'center 45%' } },
    ],
    priceNote: RATE_TEXT,
    faqHeading: 'Before moving day',
    faqs: [
      PRICE_FAQ,
      { q: 'When does the clock start?', a: 'When the crew arrives at your pickup address, and it stops when the last piece is in place at the new one.' },
      INCLUDED_FAQ,
      { q: 'My building needs an elevator booking. Who arranges it?', a: 'You book the elevator and loading bay with your building for the arrival window we give you. We work inside the building\'s rules from there.' },
      { q: 'Do 2 or 3 movers make more sense for me?', a: 'Two movers suit most studios and one-bedrooms. For two bedrooms and up, 3 movers with the bigger truck usually finish sooner. Tell us your home size and we will suggest one.' },
      { q: 'How far ahead should I book?', a: 'As early as you can for weekends and the end of the month. Pick a date online to see what is open.' },
    ],
    listPhoto: { src: '/about/photo-2.jpg', alt: 'A Stonegate mover standing on the truck ramp under the Moving made effortless sign', pos: 'center 40%' },
  },
  {
    slug: 'residential',
    path: '/residential-moving',
    name: 'Residential moving',
    metaTitle: 'Residential Movers in Metro Vancouver | Stonegate Moving Solutions',
    metaDescription: 'House and townhouse moves across Metro Vancouver. Furniture wrapped, taken apart and set up in your new home. 2 movers and a truck from $130/hr + GST.',
    heading: ['Residential', 'Movers'],
    cardPhoto: { src: '/hero-truck-home-natural.jpg', alt: 'The Stonegate moving truck parked in the driveway of a house', pos: '70% center' },
    cardText: 'Houses and townhouses moved room by room: taken apart, wrapped and set up again.',
    includedHeading: 'Your whole home, handled',
    heroPhoto: { src: '/hero-truck-home-natural.jpg', alt: 'The Stonegate moving truck parked in the driveway of a house', pos: '70% center' },
    intro: 'Houses, townhouses and family homes, room by room. We take apart, wrap, carry and set up again.',
    included: [
      { title: 'Every room', text: 'Bedrooms, kitchen, garage and the storage room nobody has opened in years. Everything comes out in one move.' },
      { title: 'Beds rebuilt', text: 'Bed frames, dining tables and wardrobes are taken apart, labelled and put back together in the new place.' },
      { title: 'Heavy pieces', text: 'Dressers, sectionals and appliances go down the stairs on dollies and straps, never dragged.' },
    ],
    steps: [
      { verb: 'Protect', text: 'Blankets on every piece, so it arrives the way it left.', photo: { src: '/moving/protect-wrapped-furniture.png', alt: 'A Stonegate mover wrapping furniture in a moving blanket and plastic wrap inside the home', pos: 'center 60%' } },
      { verb: 'Carry', text: 'Out of every room and down every stair, on dollies and straps.', photo: { src: '/crew-walking-truck.jpg', alt: 'A Stonegate mover walking a dolly beside the truck', pos: 'center 55%' } },
      { verb: 'Load', text: 'Packed tight and strapped so nothing shifts on the drive.', photo: { src: '/junk/crew-4557-truck-side.jpg', alt: 'A Stonegate mover loading the back of the branded truck', pos: 'center 60%' } },
      { verb: 'Rebuild', text: 'Unloaded at the new home, beds and tables put back together where you want them.', photo: { src: '/moving/rebuild-wrapped-sofas.png', alt: 'Blanket-wrapped sofas placed in the living room of the new home, ready to unwrap', pos: 'center 65%' } },
    ],
    priceNote: RATE_TEXT,
    faqHeading: 'Moving a whole home',
    faqs: [
      PRICE_FAQ,
      { q: 'How many movers does a house need?', a: 'For most homes of two bedrooms and up, 3 movers with the 16\' truck finish sooner than 2. Tell us the size of your home and we will suggest a crew.' },
      INCLUDED_FAQ,
      { q: 'Do you take apart and rebuild beds?', a: 'Yes. Bed frames, tables and other furniture that will not fit through a door are taken apart and put back together at the new home.' },
      { q: 'Can you move the garage and shed too?', a: 'Yes. Tell us about the garage, shed and outdoor furniture when you book so we bring enough truck space.' },
      { q: 'Do you pack as well?', a: 'Yes, with our packing service: full packing, just the kitchen and fragile items, or unpacking at the new home. It runs at the same hourly rate, with materials extra.' },
    ],
    listPhoto: { src: '/team-with-truck.jpg', alt: 'The Stonegate crew standing in front of the truck', pos: 'center 60%' },
  },
  {
    slug: 'commercial',
    path: '/commercial-moving',
    name: 'Commercial moving',
    metaTitle: 'Commercial Movers & Corporate Relocation in Metro Vancouver | Stonegate',
    metaDescription: 'Office, store and commercial moves plus corporate relocation for employees across Metro Vancouver. 2 movers and a truck from $130/hr + GST.',
    heading: ['Commercial', 'Movers'],
    cardPhoto: { src: '/about/photo-4.jpg', alt: 'Two Stonegate movers lifting a box into the truck', pos: 'center 60%' },
    cardText: 'Offices, stores and commercial spaces, plus corporate relocation for employees.',
    includedHeading: 'Businesses and their people',
    heroPhoto: { src: '/junk/driver-hero-4627.jpg', alt: 'A Stonegate mover standing in front of the branded moving truck', pos: 'center 72%' },
    intro: 'Offices, stores and commercial spaces moved across Metro Vancouver, and employees relocated into their new homes.',
    included: [
      { title: 'Desks to boardroom', text: 'Desks, chairs, filing cabinets, shelving and boardroom tables, taken apart where needed and set up in the new floor plan.' },
      { title: 'Corporate relocation', text: 'Moving an employee to or within Metro Vancouver? Book their home move the same way: dates, both addresses, and we do the rest.' },
      { title: 'Planned with you', text: 'Tell us the space, the timeline and the building rules. We plan the crew and the trips around them.' },
    ],
    steps: [
      { verb: 'Wrap', text: 'Desks, chairs and furniture wrapped in blankets and plastic before they leave the room.', illustration: { src: '/moving/moving-day-step-1.png', alt: 'A Stonegate mover wrapping an armchair in a moving blanket and plastic wrap' } },
      { verb: 'Load', text: 'Up the ramp and strapped in the truck, packed tight so nothing shifts.', illustration: { src: '/moving/moving-day-step-2.png', alt: 'A Stonegate mover pushing a wrapped piece of furniture up the ramp into the truck' } },
      { verb: 'Drive', text: 'Straight to the new space, planned around the building\'s loading rules.', illustration: { src: '/moving/moving-day-step-3.png', alt: 'A Stonegate mover giving a thumbs up from the cab of the moving truck' } },
      { verb: 'Set up', text: 'Furniture carried in and placed to your floor plan, ready for Monday.', illustration: { src: '/moving/moving-day-step-4.png', alt: 'A Stonegate mover carrying an armchair into the new space' } },
    ],
    priceNote: RATE_TEXT,
    faqHeading: 'Moving a business',
    faqs: [
      PRICE_FAQ,
      { q: 'Do you move offices and stores?', a: 'Yes: offices, stores, studios and other commercial spaces across Metro Vancouver. Tell us the space and the timeline and we plan the move with you.' },
      { q: 'What is corporate relocation?', a: 'Moving an employee\'s home when they relocate for work. We move them the same way we move any household: wrapped, carried and set up in the new place.' },
      INCLUDED_FAQ,
      { q: 'Our building has loading rules. Can you work with them?', a: 'Yes. Send us the building\'s rules for the loading dock and elevators and we plan the crew and the trips around them.' },
      { q: 'How do we book?', a: 'Pick a date online or call us. For a bigger office move, call first so we can plan the crew and the number of trips.' },
    ],
    listPhoto: { src: '/crew-walking-truck.jpg', alt: 'A Stonegate mover walking a dolly beside the truck', pos: 'center 55%' },
  },
  {
    slug: 'packing',
    path: '/packing-services',
    name: 'Packing services',
    metaTitle: 'Packing Services in Metro Vancouver | Stonegate Moving Solutions',
    metaDescription: 'Full or partial packing, boxes and materials supplied, and unpacking at your new home across Metro Vancouver. Same hourly rate as the move, materials extra.',
    heading: ['Packing', 'Services'],
    cardPhoto: { src: '/burnaby/burnaby-movers-hero.jpg', alt: 'Packed boxes and a wardrobe box loaded in the Stonegate truck', pos: 'center 62%', brightness: 1.4 },
    cardText: 'Full or partial packing with boxes supplied, and unpacking at the new home.',
    includedHeading: 'As much packing as you want',
    heroPhoto: { src: '/burnaby/burnaby-movers-hero.jpg', alt: 'The Stonegate truck filled with packed boxes and a wardrobe box', pos: 'center 55%', brightness: 1.5 },
    intro: 'The whole home, just the kitchen, or only what breaks. We bring the boxes and can unpack at the other end.',
    included: [
      { title: 'Full packing', text: 'Every room boxed, wrapped and labelled before the truck is loaded. You come home to a packed house.' },
      { title: 'Just the fragile', text: 'Only the kitchen, the dishes, the glass and the art. You pack the rest.' },
      { title: 'Unpacked again', text: 'At the new home we empty the boxes, put things away and take the packing material with us.' },
    ],
    steps: [
      { verb: 'Box', text: 'Boxes, paper, tape and wardrobe boxes come with the crew.', illustration: { src: '/moving/packing-step-1.png', alt: 'An open Stonegate box packed with a pillow, a picture frame and a roll of tape' } },
      { verb: 'Wrap', text: 'Dishes and glass in paper, furniture in blankets.', illustration: { src: '/moving/packing-step-2.png', alt: 'An armchair wrapped in a green moving blanket and plastic wrap' } },
      { verb: 'Label', text: 'Every box marked with its room, so it lands in the right place.', illustration: { src: '/moving/packing-step-3.png', alt: 'A taped moving box labelled Living Room' } },
      { verb: 'Unpack', text: 'Unboxed and put away in the new home, materials taken away.', illustration: { src: '/moving/packing-step-4.png', alt: 'A Stonegate box unpacked at the new home with a plant, books and a lamp' } },
    ],
    priceNote: 'Packing runs at the moving rate. Boxes and packing materials are extra, charged for what we use. 3-hour minimum, prices plus GST.',
    faqHeading: 'Packing questions',
    faqs: [
      { q: 'How is packing priced?', a: 'At the same hourly rate as the move: $130 for 2 movers or $170 for 3, plus GST. Boxes and materials are extra, charged for what we use.' },
      { q: 'What can you pack?', a: 'The whole home, or just part of it: the kitchen, dishes, glassware, art and anything else fragile.' },
      { q: 'Do you bring boxes?', a: 'Yes. The crew brings boxes, packing paper, tape and wardrobe boxes.' },
      { q: 'Do you unpack at the new home?', a: 'Yes, if you want. We unbox, put things away and take the packing material with us.' },
      { q: 'Can you pack and move on the same booking?', a: 'Yes. Tell us what you want packed when you book and the same crew packs, loads and moves it.' },
      INCLUDED_FAQ,
    ],
    listPhoto: { src: '/crew-walking-truck.jpg', alt: 'A Stonegate mover walking a dolly beside the truck', pos: 'center 55%' },
  },
]

export const SERVICE_BY_SLUG = Object.fromEntries(MOVING_SERVICES.map(s => [s.slug, s])) as Record<MovingService['slug'], MovingService>

/** Real Google reviews about moves (same wording as on the homepage) */
export const MOVING_REVIEWS = [
  {
    name: 'Fady Nasr',
    text: "Great experience with Stonegate. The team was professional, efficient, and careful with everything from start to finish. They showed up prepared, handled the move smoothly, and made the whole process much less stressful. Communication was clear, the service felt reliable, and I'd definitely recommend them to anyone looking for movers.",
  },
  {
    name: 'Le Cao Huy',
    text: 'I had a fantastic experience with Stonegate Moving Solutions. The crew arrived on time, worked efficiently, and treated my furniture and boxes with care. They were friendly, professional, and made the entire moving process much easier than…',
  },
  {
    name: 'Amirali Nasrinpay',
    text: 'The stonegate solution is the best moving company in the whole of Vancouver. They came on time picked my items and safely put them to the other location i needed them to it. They have one of the strongest times in Vancouver, very respect…',
  },
  {
    name: 'Aryan Kapoor',
    text: 'Really happy with the service. The guys were on time, worked quickly, and took good care of my stuff. The whole move went smoothly and they made the process a lot less stressful. Would definitely use them again!',
  },
]

/** The moving services as cards, linking to their pages */
export function movingServiceCards(except?: MovingService['slug']) {
  return MOVING_SERVICES.filter(o => o.slug !== except).map(o => ({
    href: o.path,
    kind: 'Moving' as const,
    name: o.name,
    text: o.cardText,
    image: o.cardPhoto,
  }))
}
