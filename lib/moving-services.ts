export interface ServicePhoto {
  src: string
  alt: string
  /** CSS object-position */
  pos?: string
  /** CSS brightness() for photos taken in low light, e.g. 1.4 */
  brightness?: number
  /** A bright, sunny photo: the hero darkens more behind the headline so the text stays readable */
  bright?: boolean
}

export interface MovingService {
  slug: 'local' | 'residential' | 'commercial' | 'office' | 'packing' | 'apartment' | 'long-distance' | 'senior' | 'specialty'
  path: string
  /** Short name used in links and the services list */
  name: string
  metaTitle: string
  metaDescription: string
  /** Hero headline: white line, then the orange line under the divider */
  heading: [string, string]
  /** Hero divider text; 'METRO VANCOUVER' when not set */
  divider?: string
  /** Where the service runs, for the structured data; Metro Vancouver when not set */
  areaServed?: string[]
  /** 'quote': priced per move instead of by the hour, so the page shows these points in place of the hourly rates */
  quotePoints?: string[]
  heroPhoto: ServicePhoto
  /** Optional different hero photo for desktop (lg and up) */
  heroPhotoDesktop?: ServicePhoto
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
    metaDescription: 'Local moving across Metro Vancouver: apartments, condos and houses. 2 movers and a truck from $130/hr + GST. Request a free estimate online.',
    heading: ['Local', 'Movers'],
    cardPhoto: { src: '/burnaby/burnaby-move-truck-loading-bright.png', alt: 'A Stonegate mover carrying wrapped furniture up the ramp into the truck', pos: 'center 40%' },
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
      { verb: 'Load', text: 'Up the ramp, strapped to the wall, packed tight so nothing shifts.', photo: { src: '/burnaby/burnaby-move-truck-loading-bright.png', alt: 'A Stonegate mover carrying wrapped furniture up the ramp into the truck', pos: 'center 45%' } },
      { verb: 'Drive', text: 'One trip across the city, planned around bridges and traffic.', photo: { src: '/junk/driver-cab-4520-mobile.jpg', alt: 'A Stonegate mover at the wheel of the moving truck', pos: 'center 62%' } },
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
    metaDescription: 'Store, showroom, studio and commercial moves plus corporate relocation for employees across Metro Vancouver. 2 movers and a truck from $130/hr + GST.',
    heading: ['Commercial', 'Movers'],
    cardPhoto: { src: '/about/photo-5.jpg', alt: 'A Stonegate mover in a branded shirt walking toward the truck', pos: 'center 40%' },
    cardText: 'Stores, showrooms and commercial spaces, plus corporate relocation for employees.',
    includedHeading: 'Businesses and their people',
    heroPhoto: { src: '/about/photo-4-warm.png', alt: 'Two Stonegate movers lifting a box into the truck', pos: 'center 53%' },
    heroPhotoDesktop: { src: '/about/photo-4-warm-desktop.png', alt: 'Two Stonegate movers lifting a box into the truck in the evening light', pos: 'center 55%', bright: true },
    intro: 'Stores, showrooms, studios and other commercial spaces moved across Metro Vancouver, and employees relocated into their new homes.',
    included: [
      { title: 'Stores and showrooms', text: 'Shelving, display furniture and boxed stock moved between locations and set up in the new space.' },
      { title: 'Studios and workspaces', text: 'Salons, studios and other workspaces: furniture and equipment wrapped, moved and placed where you want it.' },
      { title: 'Corporate relocation', text: 'Moving an employee to or within Metro Vancouver? Book their home move the same way: dates, both addresses, and we do the rest.' },
    ],
    steps: [
      { verb: 'Wrap', text: 'Furniture and fixtures wrapped in blankets and plastic before they leave.', photo: { src: '/moving/protect-wrapped-furniture.png', alt: 'A Stonegate mover wrapping furniture in a moving blanket', pos: 'center 55%' } },
      { verb: 'Load', text: 'Up the ramp and strapped in the truck, packed tight so nothing shifts.', photo: { src: '/burnaby/burnaby-move-truck-loading-bright.png', alt: 'A Stonegate mover carrying wrapped furniture up the ramp into the truck', pos: 'center 45%' } },
      { verb: 'Drive', text: 'Straight to the new space, planned around the building\'s loading rules.', photo: { src: '/junk/driver-cab-4534-mobile.jpg', alt: 'A Stonegate mover at the wheel of the moving truck', pos: 'center 62%' } },
      { verb: 'Set up', text: 'Carried in and placed where you want it, ready to open.', photo: { src: '/moving/rebuild-wrapped-sofas.png', alt: 'Blanket-wrapped furniture placed in the new space, ready to unwrap', pos: 'center 65%' } },
    ],
    priceNote: RATE_TEXT,
    faqHeading: 'Moving a business',
    faqs: [
      PRICE_FAQ,
      { q: 'What kinds of businesses do you move?', a: 'Stores, showrooms, studios and other commercial spaces across Metro Vancouver. Moving an office? See our office moving page.' },
      { q: 'What is corporate relocation?', a: 'Moving an employee\'s home when they relocate for work. We move them the same way we move any household: wrapped, carried and set up in the new place.' },
      INCLUDED_FAQ,
      { q: 'Our building has loading rules. Can you work with them?', a: 'Yes. Send us the building\'s rules for the loading dock and elevators and we plan the crew and the trips around them.' },
      { q: 'How do we book?', a: 'Request a free estimate online or call us. For a bigger move, call first so we can plan the crew and the number of trips.' },
    ],
    listPhoto: { src: '/crew-walking-truck.jpg', alt: 'A Stonegate mover walking a dolly beside the truck', pos: 'center 55%' },
  },
  {
    slug: 'office',
    path: '/office-moving',
    name: 'Office moving',
    metaTitle: 'Office Movers in Metro Vancouver | Stonegate Moving Solutions',
    metaDescription: 'Office moves across Metro Vancouver: desks, chairs, filing cabinets and boardroom tables taken apart, moved and set up to your floor plan. 2 movers and a truck from $130/hr + GST.',
    heading: ['Office', 'Movers'],
    cardPhoto: { src: '/junk/driver-beside-truck.png', alt: 'A Stonegate mover standing at the back of the truck under the Moving made effortless sign', pos: 'center 30%' },
    cardText: 'Desks, chairs, filing cabinets and boardrooms, set up to your new floor plan.',
    includedHeading: 'From the old desk to the new one',
    heroPhoto: { src: '/about/photo-4-warm.png', alt: 'Two Stonegate movers lifting a box into the truck', pos: 'center 53%' },
    heroPhotoDesktop: { src: '/about/photo-4-warm-desktop.png', alt: 'Two Stonegate movers lifting a box into the truck in the evening light', pos: 'center 55%', bright: true },
    intro: 'Small offices to whole floors across Metro Vancouver. Desks and boardrooms taken apart, moved and set up to your new floor plan.',
    included: [
      { title: 'Desks to boardroom', text: 'Desks, chairs, filing cabinets, shelving and boardroom tables, taken apart where needed and put back together.' },
      { title: 'Set up to your floor plan', text: 'Send us the new layout and every desk, chair and cabinet goes where it belongs.' },
      { title: 'Planned around your building', text: 'Loading docks, elevator bookings and building hours: tell us the rules at both addresses and we plan the crew and the trips around them.' },
    ],
    steps: [
      { verb: 'Wrap', text: 'Desks, chairs and furniture wrapped in blankets and plastic before they leave the room.', illustration: { src: '/moving/moving-day-step-1.png', alt: 'A Stonegate mover wrapping an armchair in a moving blanket and plastic wrap' } },
      { verb: 'Load', text: 'Up the ramp and strapped in the truck, packed tight so nothing shifts.', illustration: { src: '/moving/moving-day-step-2.png', alt: 'A Stonegate mover pushing a wrapped piece of furniture up the ramp into the truck' } },
      { verb: 'Drive', text: 'Straight to the new office, planned around the building\'s loading rules.', illustration: { src: '/moving/moving-day-step-3.png', alt: 'A Stonegate mover giving a thumbs up from the cab of the moving truck' } },
      { verb: 'Set up', text: 'Furniture carried in and placed to your floor plan, ready for Monday.', illustration: { src: '/moving/moving-day-step-4.png', alt: 'A Stonegate mover carrying an armchair into the new office' } },
    ],
    priceNote: RATE_TEXT,
    faqHeading: 'Moving an office',
    faqs: [
      PRICE_FAQ,
      { q: 'How big an office can you move?', a: 'From a few desks to a whole floor. Tell us the number of workstations and the furniture, and we suggest a crew and the number of trips.' },
      { q: 'Can you set everything up in the new office?', a: 'Yes. Send us the floor plan and we place the desks, chairs, cabinets and boardroom furniture where they belong.' },
      { q: 'Our building has loading rules. Can you work with them?', a: 'Yes. Send us the building\'s rules for the loading dock and elevators and we plan the crew and the trips around them.' },
      INCLUDED_FAQ,
      { q: 'How do we book?', a: 'Request a free estimate online or call us. For a bigger office, call first so we can plan the crew and the number of trips.' },
    ],
    listPhoto: { src: '/junk/driver-cab-4534-mobile.jpg', alt: 'A smiling Stonegate mover in the cab of the truck', pos: 'center 45%' },
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
    heroPhoto: { src: '/packing/packing-truck-rainy.png', alt: 'The Stonegate truck loaded with packed boxes and a wardrobe box, the ramp down', pos: '58% center', bright: true },
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
  {
    slug: 'apartment',
    path: '/apartment-moving',
    name: 'Apartment & condo moving',
    metaTitle: 'Apartment & Condo Movers in Metro Vancouver | Stonegate Moving Solutions',
    metaDescription: 'Apartment and condo moves across Metro Vancouver: elevator bookings, loading bays and walk-ups handled. 2 movers and a truck from $130/hr + GST. Request a free estimate.',
    heading: ['Apartment &', 'Condo Movers'],
    cardPhoto: { src: '/burnaby/burnaby-move-truck-loaded.jpg', alt: 'The Stonegate truck loaded with bins, boxes and a wrapped mattress', pos: 'center 55%' },
    cardText: 'Studios to three-bedroom suites, moved around elevator bookings and building rules.',
    includedHeading: 'Made for buildings',
    heroPhoto: { src: '/apartment/apartment-truck-street.png', alt: 'A Stonegate mover walking a dolly along the sidewalk beside the Stonegate truck', pos: '60% center' },
    heroPhotoDesktop: { src: '/apartment/apartment-truck-street-desktop.png', alt: 'A Stonegate mover walking a dolly along a sunny sidewalk beside the Stonegate truck', pos: 'center 40%', bright: true },
    intro: 'From studios to three-bedroom suites, we move you in and out of any building, on time for your elevator booking.',
    included: [
      { title: 'Elevator bookings', text: 'Book the elevator and loading bay for the arrival window we give you, and the crew works inside your booking.' },
      { title: 'Walk-ups and tight stairs', text: 'No elevator? Fourth-floor walk-ups and narrow stairwells are handled with straps, dollies and the right crew size.' },
      { title: 'Furniture that fits', text: 'Beds, tables and sectionals are taken apart to get through doors and hallways, then put back together in the new suite.' },
    ],
    steps: [
      { verb: 'Wrap', text: 'Every piece goes into blankets before it leaves the suite.', photo: { src: '/moving/protect-wrapped-furniture.png', alt: 'A Stonegate mover wrapping furniture in a moving blanket inside the home', pos: 'center 55%' } },
      { verb: 'Carry', text: 'Down the elevator or the stairs on dollies, without scuffing the halls.', photo: { src: '/crew-walking-truck.jpg', alt: 'A Stonegate mover walking a dolly beside the truck', pos: 'center 55%' } },
      { verb: 'Load', text: 'Up the ramp and strapped in, packed tight so nothing shifts.', photo: { src: '/burnaby/burnaby-move-truck-loading-bright.png', alt: 'A Stonegate mover carrying wrapped furniture up the ramp into the truck', pos: 'center 45%' } },
      { verb: 'Set up', text: 'Carried into the new suite and put back together where you want it.', photo: { src: '/moving/rebuild-wrapped-sofas.png', alt: 'Blanket-wrapped sofas placed in the living room of the new home, ready to unwrap', pos: 'center 65%' } },
    ],
    priceNote: RATE_TEXT,
    faqHeading: 'Moving an apartment or condo',
    faqs: [
      PRICE_FAQ,
      { q: 'My building needs an elevator booking. Who arranges it?', a: 'You book the elevator and loading bay with your building for the arrival window we give you. We work inside the building\'s rules from there.' },
      { q: 'How long does a one-bedroom move take?', a: 'Most one-bedroom moves take 3 to 4 hours with 2 movers. Floors, elevator waits and the distance between the two buildings all change it.' },
      { q: 'Do you move walk-up apartments?', a: 'Yes. Tell us the floor and the stairs at both addresses so we bring the right crew size for them.' },
      { q: 'Do 2 or 3 movers make more sense for me?', a: 'Two movers suit most studios and one-bedrooms. For two bedrooms and up, 3 movers with the bigger truck usually finish sooner.' },
      INCLUDED_FAQ,
    ],
    listPhoto: { src: '/burnaby/burnaby-move-crew-loading.jpg', alt: 'A Stonegate mover loading boxes into the truck', pos: 'center 45%' },
  },
  {
    slug: 'long-distance',
    path: '/long-distance-moving',
    name: 'Long-distance moving',
    metaTitle: 'Long-Distance Movers from Vancouver to BC & Alberta | Stonegate',
    metaDescription: 'Long-distance moves between Metro Vancouver and anywhere in BC or Alberta: Vancouver Island, the Okanagan, Kamloops, Calgary, Edmonton and more. One flat quote for your move.',
    heading: ['Long-Distance', 'Movers'],
    divider: 'BC & ALBERTA',
    areaServed: ['British Columbia', 'Alberta'],
    cardPhoto: { src: '/junk/stonegate-truck-crew.jpg', alt: 'Stonegate movers at the back of the branded truck', pos: 'center 45%' },
    cardText: 'Moves between Metro Vancouver and anywhere in BC or Alberta, for one flat price.',
    includedHeading: 'Across BC and into Alberta',
    heroPhoto: { src: '/hero-truck.jpg', alt: 'The Stonegate moving truck parked on a residential street', pos: 'center 60%' },
    intro: 'Moving to Vancouver Island, the Okanagan, Calgary or Edmonton? We load, drive and unload your home for one flat price.',
    included: [
      { title: 'Anywhere in BC and Alberta', text: 'Vancouver Island, the Okanagan, Kamloops, the Kootenays, northern BC, Calgary, Edmonton and the towns in between.' },
      { title: 'One flat quote', text: 'Send us both addresses, the size of your home and your dates. We quote one price for the whole move.' },
      { title: 'Packed for the highway', text: 'Furniture wrapped in blankets, strapped to the truck walls and packed tight, so nothing shifts on a long drive.' },
    ],
    steps: [
      { verb: 'Wrap', text: 'Every piece wrapped in blankets and plastic before it leaves the room.', illustration: { src: '/moving/moving-day-step-1.png', alt: 'A Stonegate mover wrapping an armchair in a moving blanket and plastic wrap' } },
      { verb: 'Load', text: 'Strapped in and packed tight for the long drive.', illustration: { src: '/moving/moving-day-step-2.png', alt: 'A Stonegate mover pushing a wrapped piece of furniture up the ramp into the truck' } },
      { verb: 'Drive', text: 'Straight to your new town, on the dates we agreed.', illustration: { src: '/moving/moving-day-step-3.png', alt: 'A Stonegate mover giving a thumbs up from the cab of the moving truck' } },
      { verb: 'Unload', text: 'Carried in, unwrapped and put back together in the new home.', illustration: { src: '/moving/moving-day-step-4.png', alt: 'A Stonegate mover carrying an armchair into the new home' } },
    ],
    quotePoints: ['One flat price for your route and your home', 'Loading, the drive and unloading in one quote', 'Confirmed with you before moving day'],
    priceNote: 'Long-distance moves are quoted as one flat price, based on your route, the size of your home and your dates. Request a free estimate and we confirm the price before moving day. Prices plus GST.',
    faqHeading: 'Moving out of town',
    faqs: [
      { q: 'Where do you move to?', a: 'Anywhere in BC and Alberta, to or from Metro Vancouver: Vancouver Island, the Okanagan, Kamloops, the Kootenays, northern BC, Calgary, Edmonton and the towns along the way.' },
      { q: 'How is a long-distance move priced?', a: 'With one flat quote for the whole move, based on the distance, the size of your home and your dates. Request a free estimate with both addresses and we send you the price.' },
      { q: 'Do you move to Vancouver Island?', a: 'Yes. Tell us the town and we plan the ferry crossing into the move.' },
      { q: 'How far ahead should I book?', a: 'As early as you can, especially for the end of the month. A few weeks\' notice gives us the best chance to fit your dates.' },
      { q: 'Can you pack for a long-distance move?', a: 'Yes, with our packing service. Tell us what you want packed when you request your estimate and we include it in the quote.' },
      INCLUDED_FAQ,
    ],
    listPhoto: { src: '/junk/crew-4539-cab.jpg', alt: 'A Stonegate mover standing at the open cab door of the truck', pos: 'center 40%' },
  },
  {
    slug: 'senior',
    path: '/senior-moving',
    name: 'Senior moving',
    metaTitle: 'Senior Movers in Metro Vancouver | Downsizing & Retirement Moves | Stonegate',
    metaDescription: 'Moves for seniors across Metro Vancouver: help with downsizing, packing and unpacking, moves into retirement residences and the new home set up on day one. From $130/hr + GST.',
    heading: ['Senior', 'Movers'],
    cardPhoto: { src: '/junk/crew-4580-by-cab.jpg', alt: 'A Stonegate mover smiling beside the open cab of the truck', pos: 'center 45%' },
    cardText: 'Downsizing and moves into retirement residences, packed, moved and set up for day one.',
    includedHeading: 'A calmer move, start to finish',
    heroPhoto: { src: '/junk/crew-4628-by-truck.jpg', alt: 'A smiling Stonegate mover with arms crossed beside the truck', pos: '30% 65%' },
    intro: 'Downsizing, a move into a retirement residence, or closer to family. We pack, move and set up the new home, and take the time to get it right.',
    included: [
      { title: 'Downsizing help', text: 'Moving somewhere smaller? We help sort what comes along, so only the furniture that fits makes the trip.' },
      { title: 'Packed and unpacked', text: 'We box up the home, label every box by room and unpack at the other end.' },
      { title: 'Retirement residences', text: 'Retirement homes, assisted living and care residences: we work around their move-in times, elevator bookings and rules.' },
      { title: 'Home on day one', text: 'Beds put together and made up, furniture placed where you want it and favourite things put away, so the first night feels like home.' },
    ],
    steps: [
      { verb: 'Sort', text: 'Decide together what comes to the new home.', illustration: { src: '/moving/packing-step-1.png', alt: 'An open Stonegate box packed with a pillow, a picture frame and a roll of tape' } },
      { verb: 'Pack', text: 'Dishes, photos and keepsakes wrapped and boxed by room.', illustration: { src: '/moving/packing-step-3.png', alt: 'A taped moving box labelled Living Room' } },
      { verb: 'Move', text: 'Loaded, driven and carried into the new home.', illustration: { src: '/moving/moving-day-step-2.png', alt: 'A Stonegate mover pushing a wrapped piece of furniture up the ramp into the truck' } },
      { verb: 'Settle in', text: 'Beds made up, boxes unpacked and things put away.', illustration: { src: '/moving/packing-step-4.png', alt: 'A Stonegate box unpacked at the new home with a plant, books and a lamp' } },
    ],
    priceNote: 'Senior moves run at the moving rate, with packing and unpacking at the same hourly rate. Boxes and packing materials are extra, charged for what we use. 3-hour minimum, prices plus GST.',
    faqHeading: 'Moving a parent or yourself',
    faqs: [
      PRICE_FAQ,
      { q: 'Can you help decide what to bring?', a: 'Yes. Tell us about the new home and we help sort what fits and what stays behind before moving day.' },
      { q: 'Do you move people into retirement residences?', a: 'Yes: retirement homes, assisted living and care residences. Send us the residence\'s move-in rules and we plan the move around them.' },
      { q: 'Can I book the move for my parent?', a: 'Of course. Request the estimate in your name, add your parent\'s addresses and tell us who to contact on moving day.' },
      { q: 'Do you set up the new home?', a: 'Yes. Beds go back together and get made up, furniture is placed where you want it and boxes are unpacked.' },
      { q: 'Do you bring boxes?', a: 'Yes. The crew brings boxes, packing paper, tape and wardrobe boxes.' },
    ],
    listPhoto: { src: '/junk/driver-cab-4520-mobile.jpg', alt: 'A smiling Stonegate mover leaning out of the truck cab window', pos: 'center 45%' },
  },
  {
    slug: 'specialty',
    path: '/specialty-moving',
    name: 'Specialty moving',
    metaTitle: 'Piano, Safe & Specialty Item Movers in Metro Vancouver | Stonegate',
    metaDescription: 'Pianos, heavy safes, art, antiques, gym equipment and appliances moved across Metro Vancouver. Wrapped, strapped and carried with the right crew and gear.',
    heading: ['Specialty', 'Movers'],
    cardPhoto: { src: '/junk/driver-standing-mobile-wide-3.jpg', alt: 'A Stonegate mover with arms crossed beside the truck', pos: 'center 30%' },
    cardText: 'Pianos, heavy safes, art and antiques, gym equipment and appliances.',
    includedHeading: 'Heavy, fragile and one of a kind',
    heroPhoto: { src: '/specialty/specialty-truck-at-work.png', alt: 'A Stonegate mover securing a wooden crate in the back of the truck', pos: '50% center', bright: true },
    intro: 'Pianos, safes, art and antiques, home gyms and appliances. Heavy or fragile, it is wrapped, strapped and carried with the right gear.',
    included: [
      { title: 'Pianos', text: 'Wrapped in blankets and moved on dollies and straps. Tell us the type of piano and the stairs at both ends.' },
      { title: 'Heavy safes', text: 'Gun safes and heavy home or office safes, moved with the crew size and equipment the weight needs.' },
      { title: 'Art and antiques', text: 'Artwork, mirrors and antiques wrapped piece by piece and loaded so nothing presses on them.' },
      { title: 'Gym gear and appliances', text: 'Treadmills, home gyms, fridges, washers and dryers, taken apart where needed and carried down the stairs safely.' },
    ],
    steps: [
      { verb: 'Plan', text: 'Tell us the item, its weight and the stairs, and we plan the crew.', photo: { src: '/crew-loading-ramp.jpg', alt: 'A Stonegate mover sliding out the truck ramp', pos: 'center 45%' } },
      { verb: 'Wrap', text: 'Blankets and plastic on every surface that can scratch.', photo: { src: '/moving/protect-wrapped-furniture.png', alt: 'A Stonegate mover wrapping furniture in a moving blanket inside the home', pos: 'center 55%' } },
      { verb: 'Secure', text: 'Strapped upright to the truck wall so it cannot tip or slide.', photo: { src: '/junk/crew-4557-truck-side.jpg', alt: 'A Stonegate mover loading the back of the branded truck', pos: 'center 60%' } },
      { verb: 'Place', text: 'Carried in and set exactly where it belongs.', photo: { src: '/moving/rebuild-wrapped-sofas.png', alt: 'Blanket-wrapped furniture placed in the new home, ready to unwrap', pos: 'center 65%' } },
    ],
    quotePoints: ['Quoted for the item, its weight and the stairs', 'On its own or with the rest of your move', 'Confirmed with you before moving day'],
    priceNote: 'Specialty items are quoted for the piece, its weight and the stairs at both ends, on their own or with the rest of your move. Request a free estimate and we confirm the price before moving day. Prices plus GST.',
    faqHeading: 'Moving something special',
    faqs: [
      { q: 'What specialty items do you move?', a: 'Pianos, gun safes and other heavy safes, art and antiques, mirrors, home gym equipment and large appliances like fridges and washers.' },
      { q: 'How is a piano or safe move priced?', a: 'It depends on the item, its weight and the stairs at both ends. Tell us about it when you request your estimate and we confirm the price before moving day.' },
      { q: 'Can you move one item on its own?', a: 'Yes. A piano, safe or appliance can be moved on its own or as part of a full move.' },
      { q: 'What do you need to know about my piano?', a: 'The type of piano, the stairs and turns at both addresses, and whether there is an elevator. A photo helps.' },
      { q: 'How do you protect art and antiques?', a: 'Each piece is wrapped on its own in blankets and plastic, and loaded so nothing rests against it on the drive.' },
      INCLUDED_FAQ,
    ],
    listPhoto: { src: '/junk/driver-standing-by-truck-side-2.jpg', alt: 'A Stonegate mover standing beside the branded truck', pos: 'center 30%' },
  },
]

export const SERVICE_BY_SLUG = Object.fromEntries(MOVING_SERVICES.map(s => [s.slug, s])) as Record<MovingService['slug'], MovingService>

/** Real Google reviews about moves, newest first. The homepage, Burnaby page, service pages and /order all use this list */
export const MOVING_REVIEWS = [
  {
    name: 'Diana K',
    text: 'Great service. The guys were super punctual, careful and got things done at a very reasonable time. Would recommend!',
  },
  {
    name: 'Chanvi Kotak',
    text: "Ricardo and Dae'jhun (DJ) were very efficient. Extremely quick and super helpful. Made our move easy.",
  },
  {
    name: 'Arista Maharjan',
    text: 'We had a great experience with this moving company! The team was friendly, professional, and handled our belongings with care. They made the moving process smooth and stress-free. Everything went well, and we really appreciate their help. Highly recommend their service!',
  },
  {
    name: 'Sana Hamid',
    text: 'I had a very good experience with Stonegate Moving. They moved stuff for us from multiple locations on the same day, working 15 hours straight! Very courteous and skilled. Would be happy to use their services again.',
  },
  {
    name: 'Le Cao Huy',
    text: 'I had a fantastic experience with Stonegate Moving Solutions. The crew arrived on time, worked efficiently, and treated my furniture and boxes with care. They were friendly, professional, and made the entire moving process much easier than I expected. I would definitely use their services again and highly recommend them to anyone looking for reliable movers.',
  },
  {
    name: 'Tabitha Marie Geraghty',
    text: 'Amazing communication, pleasant and efficient service. These two movers who attended were kind and so helpful…',
  },
  {
    name: 'Fady Nasr',
    text: "Great experience with Stonegate. The team was professional, efficient, and careful with everything from start to finish. They showed up prepared, handled the move smoothly, and made the whole process much less stressful. Communication was clear, the service felt reliable, and I'd definitely recommend them to anyone looking for movers.",
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
