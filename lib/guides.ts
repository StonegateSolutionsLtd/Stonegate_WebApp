import type { Faq } from './seo/site'

/**
 * Moving guides (/guides). Each guide follows one template: one customer question as the H1, a direct answer at the top,
 * practical sections, firsthand notes from our own moves, 2-4 contextual links, sources, a quote CTA and dated trust info.
 *
 * Text fields accept inline links written as [link text](/path) - keep internal links to pages that answer a related question.
 */

export type GuideBlock =
  | { type: 'h2'; text: string; id: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  /** Tickable-looking list of things to do */
  | { type: 'checklist'; items: string[] }
  | { type: 'table'; head: string[]; rows: string[][]; caption?: string }
  /** 'crew': firsthand notes from Stonegate moves; 'tip': practical aside; 'note': caveat */
  | { type: 'callout'; tone: 'crew' | 'tip' | 'note'; title: string; text: string }
  | { type: 'image'; src: string; alt: string; caption?: string; credit?: GuideCredit; portrait?: boolean }
  /** Pull quote: one line from the article, set large between paragraphs */
  | { type: 'quote'; text: string }

export interface GuideCredit {
  /** e.g. 'Robert Ashworth / Wikimedia Commons' */
  author: string
  license: string
  href: string
}

export interface Guide {
  slug: string
  /** H1: one clear customer question or topic */
  title: string
  /** <title>, used as is (no brand suffix) so the search phrase fits in about 60 characters */
  metaTitle: string
  description: string
  /** Short label for cards and breadcrumbs */
  short: string
  /** The direct answer, shown right under the H1 */
  answer: string
  hero: { src: string; alt: string; pos?: string; credit?: GuideCredit }
  /** ISO dates. `updated` changes only with a substantive edit; `reviewed` when the facts were last checked */
  published: string
  updated: string
  reviewed: string
  /** Not listed, not in the sitemap and noindex until the missing facts are filled in */
  draft?: boolean
  body: GuideBlock[]
  faqs?: Faq[]
  sources?: { label: string; href: string }[]
  /**
   * Search phrases this guide is written to rank and be cited for, main target first.
   * They are worked into the title, description, headings, FAQs and text, and listed in the Article markup.
   * Commercial "movers in <city>" phrases belong to the service and city pages, not here.
   */
  keywords: string[]
  /** 3-5 one-line facts under the opening answer: the summary answer engines and skimmers lift */
  takeaways: string[]
  /** The 2-4 pages this guide supports */
  related: { href: string; label: string; text: string }[]
}

const WEST_END_CREDIT: GuideCredit = {
  author: 'Robert Ashworth / Wikimedia Commons',
  license: 'CC BY 2.0',
  href: 'https://commons.wikimedia.org/wiki/File:Dense_west_end_apartments_from_Burrard_Street_Bridge_(7735482928).jpg',
}

const BENTALL_CREDIT: GuideCredit = {
  author: 'Bull-Doser / Wikimedia Commons',
  license: 'Public domain',
  href: 'https://commons.wikimedia.org/wiki/File:3_Bentall_Centre_(Vancouver_2010).jpg',
}

const SOURCE = {
  strataRegulation: { label: 'BC Laws: Strata Property Regulation, s. 6.9 (user fees for common property)', href: 'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/43_2000' },
  vancouverStreetPermit: { label: 'City of Vancouver: Reserve parking spaces and meters with temporary street occupancy permits', href: 'https://vancouver.ca/streets-transportation/reserve-metered-spaces.aspx' },
  cnvStreetUse: { label: 'City of North Vancouver: Street use permits', href: 'https://www.cnv.org/Streets-Transportation/Street-Use-Permits' },
}

export const GUIDES: Guide[] = [
  {
    slug: 'vancouver-condo-moving-checklist',
    title: 'Vancouver Condo Moving Checklist: Elevator Booking, Strata Rules and Truck Parking',
    metaTitle: 'Vancouver Condo Moving Checklist: Elevator, Strata & Parking',
    description: 'Vancouver condo moving checklist: booking the freight elevator, strata move-in and move-out fees in BC, loading bays and moving truck parking permits.',
    keywords: [
      "condo moving checklist Vancouver",
      "moving into a condo checklist",
      "condo move-in rules Vancouver",
      "strata move-in fee BC",
      "strata move-out fee BC",
      "how to book an elevator for moving",
      "freight elevator booking for a move",
      "moving truck parking permit Vancouver",
      "temporary street occupancy permit Vancouver",
      "certificate of insurance for movers condo",
      "apartment moving checklist Vancouver",
    ],
    takeaways: [
      "Book the elevator (on service mode, with wall pads) and the loading bay at both buildings before you book the movers.",
      "In BC, a strata move-in or move-out fee must be reasonable and set out in a bylaw or ratified rule (Strata Property Regulation, s. 6.9).",
      "No loading bay? Reserve street space with a City of Vancouver temporary street occupancy permit, at least 7 to 10 business days ahead.",
      "Ask the building whether your movers must provide a certificate of insurance.",
      "Measure your largest furniture against the elevator cab and doors before moving day.",
    ],
    short: 'Condo moving checklist',
    answer: 'Book the elevator and the loading bay with your strata or property manager in writing, for both buildings, before you book a moving time. Ask about move hours, deposits, any move-in fee and whether your movers need to send a certificate of insurance. If there is no loading bay, reserve street space for the truck: the City of Vancouver needs 7 to 10 business days to issue the permit. Then measure your largest pieces against the elevator and doors.',
    hero: { src: '/guides/vancouver-west-end-condo-towers.jpg', alt: 'Apartment and condo towers in Vancouver\'s West End seen from the Burrard Street Bridge', pos: 'center 40%', credit: WEST_END_CREDIT },
    published: '2026-11-08',
    updated: '2026-11-08',
    reviewed: '2026-11-08',
    body: [
      { type: 'h2', id: 'weeks-before', text: 'Condo moving checklist: book the elevator 2 to 3 weeks before' },
      { type: 'p', text: 'In a condo, the building sets your schedule, not the movers. Most Vancouver towers give you a fixed elevator window, and many give the loading bay to one move at a time. Get both confirmed first, then book the crew to match.' },
      { type: 'quote', text: 'In a condo, the building sets your schedule, not the movers.' },
      { type: 'checklist', items: [
        'Email your strata manager or building manager (or your landlord, if you rent) and ask for the move-in/move-out form and the building\'s moving rules.',
        'Reserve the elevator for a specific date and time window, and ask that it be put on independent (service) mode with wall pads installed.',
        'Reserve the loading bay or the closest short-term parking for the truck, and ask for the clearance height if the bay is underground.',
        'Do the same at the building you are moving into. Two buildings means two bookings, and the windows have to line up.',
        'Ask whether there is a move-in fee, a refundable damage deposit, or both, and how each is paid.',
        'Ask whether the building needs a certificate of insurance from your movers. If it does, send us the building\'s details when you book.',
        'Find out which door, hallway and elevator the crew must use, and where the fob or key comes from on the day.',
      ] },
      { type: 'h2', id: 'questions', text: 'Questions to ask your strata before you move in or out' },
      { type: 'table', head: ['Question', 'Why it matters on moving day'], rows: [
        ['What are the allowed move hours?', 'Many buildings allow moves only on certain days or hours. The crew\'s arrival time has to fit inside the window, with time to load.'],
        ['How long is the elevator booking?', 'If the booking ends before the last load, the move stops. A short booking can be the reason to choose 3 movers instead of 2.'],
        ['Is there a loading bay, and what is its clearance?', 'Underground bays can be too low for a moving truck. Then the truck parks on the street and the carry gets longer.'],
        ['Is there a move-in fee or a deposit?', 'Fees have to be set out in the strata\'s bylaws or ratified rules (see below). Deposits are usually returned after the common areas are checked.'],
        ['Does the building want a certificate of insurance?', 'Some buildings will not let a crew in without one on file. Sort it out before moving day, not at the front desk.'],
        ['Which areas need protecting?', 'Elevator pads, lobby floor runners and corner guards are often required. Knowing in advance avoids deposit deductions.'],
      ] },
      { type: 'h2', id: 'fees', text: 'Strata move-in and move-out fees in BC: what the rules say' },
      { type: 'p', text: 'In British Columbia, a strata corporation can charge user fees for common property such as the elevator, but under section 6.9 of the Strata Property Regulation only if the fee is reasonable and it is set out in a bylaw or in a rule ratified under section 125(6) of the Strata Property Act. The same test applies to a move-in fee and a move-out fee. If your building quotes one, ask which bylaw or rule it comes from.' },
      { type: 'callout', tone: 'note', title: 'Not legal advice', text: 'This is a summary of the regulation, not legal advice. If you think a fee is unreasonable, your strata\'s bylaws and the Civil Resolution Tribunal are the places to look.' },
      { type: 'h2', id: 'parking', text: 'Moving truck parking in Vancouver: loading bays and street permits' },
      { type: 'p', text: 'Without a loading bay, the truck needs a legal spot as close to the entrance as possible: every extra metre of carry is paid for in time. On metered or restricted streets in the City of Vancouver, you can reserve the space with a temporary street occupancy permit.' },
      { type: 'list', items: [
        'Apply early. The City asks for at least 7 to 10 business days from payment to issue the permit.',
        'Have the exact location, the existing parking rules (meters or reserved parking) and the date and time ready.',
        'A City crew puts up the no-parking signs 1 to 2 business days before the reserved time.',
        'The permit is for the moving truck, not for the crew\'s cars, and it cannot be used to move a car that was already legally parked there.',
        'Fees are set by bylaw and change, so check the current amount on the City\'s page when you apply.',
      ] },
      { type: 'p', text: 'Other cities run their own process. For the North Shore, for example, the City of North Vancouver issues street use permits. If you are moving between cities, check both. Moving in Burnaby? See our [Burnaby movers](/burnaby-movers) page for local details.' },
      { type: 'h2', id: 'measure', text: 'Will your furniture fit in the elevator? Measure the week before' },
      { type: 'checklist', items: [
        'Measure the elevator door and cab (width, depth and height, including the ceiling hatch if your building allows it to be opened).',
        'Measure your sofa, mattress, wardrobe and any desk that does not come apart, and compare.',
        'Pack in boxes that stack, and keep each box liftable by one person. Loose bags and open bins slow every elevator trip.',
        'Label boxes by room so the crew can unload floor by floor without stopping to ask.',
        'Keep the elevator fob, parking pass and both building contacts in your hand, not in a box.',
      ] },
      { type: 'image', src: '/burnaby/burnaby-move-apartment-boxes.jpg', alt: 'A Stonegate mover carrying a blanket-wrapped dresser up the truck ramp during an apartment move, with packed boxes and bags on the sidewalk', caption: 'An apartment move in Burnaby: furniture goes onto the truck wrapped, and packed boxes wait by the ramp so each trip is full.', portrait: true },
      { type: 'h2', id: 'moving-day', text: 'Condo moving day: elevator, wall pads and the final walk-through' },
      { type: 'list', ordered: true, items: [
        'Meet the crew at the entrance with the fob and confirm the elevator is on service mode with pads up.',
        'Walk the crew through what is going and what is staying, and point out anything fragile or heavy.',
        'The crew wraps furniture inside the unit and protects floors and door frames before carrying out.',
        'The elevator stays dedicated to the move while loading, so trips are full and the window is used well.',
        'At the new building, repeat the elevator check, then place furniture room by room.',
        'Before the crew leaves, walk the common areas with the building manager if a deposit is involved.',
      ] },
      { type: 'callout', tone: 'crew', title: 'How we handle condo moves', text: 'In a tower, the elevator window is the whole schedule, so we size the crew to finish inside your booking. Blankets, straps, dollies and floor and door-frame protection come on every move, and furniture is wrapped inside the unit before it goes into the hallway. Tell us the floor, the building\'s move hours and how far the truck parks from the door when you book.' },
    ],
    faqs: [
      { q: 'Do I need to book the elevator to move into a condo?', a: 'In most Vancouver condo buildings, yes. Moves are only allowed with a reserved elevator, usually on service mode with wall pads, and often only during set move hours. Book it with your strata or property manager before you book the movers.' },
      { q: 'How far ahead should I book the elevator in a Vancouver condo?', a: 'As soon as you have a moving date, and before you book the movers. Weekend and end-of-month slots go first. Book both the building you are leaving and the one you are moving into.' },
      { q: 'Can a strata charge a move-in fee in BC?', a: 'Yes, if it is reasonable and set out in a bylaw or a ratified rule, under section 6.9 of the Strata Property Regulation. Ask your strata which bylaw or rule the fee comes from.' },
      { q: 'Can a strata charge a move-out fee in BC?', a: 'A move-out fee is a user fee like a move-in fee, so the same rule applies: it must be reasonable and set out in a bylaw or a rule ratified at a general meeting.' },
      { q: 'What is a certificate of insurance for movers?', a: 'A document from the moving company\'s insurer showing its liability coverage. Some buildings require one on file before they let a moving crew in, so ask your building what it needs and pass the details to your movers when you book.' },
      { q: 'Do I need a permit to park a moving truck in Vancouver?', a: 'If there is no loading bay and you need a metered or restricted space, you can reserve it with a City of Vancouver temporary street occupancy permit. Apply at least 7 to 10 business days ahead.' },
      { q: 'How many movers do I need for a condo move?', a: 'Two movers for a studio, 1-bedroom or 2-bedroom condo. For anything bigger, we recommend 3 movers. A short elevator booking can also be a reason to add a third mover.' },
      { q: 'How long does a condo move take?', a: 'With 2 movers, a 1-bedroom condo takes 3 to 6 hours on average and a 2-bedroom 4 to 9 hours. Elevator waits, the walk from the loading bay and unpacked boxes push it to the high end. See [how long it takes to move](/guides/how-long-does-it-take-to-move-a-house) for the full breakdown.' },
    ],
    sources: [SOURCE.strataRegulation, SOURCE.vancouverStreetPermit, SOURCE.cnvStreetUse],
    related: [
      { href: '/apartment-moving', label: 'Apartment & Condo Moving', text: 'How we handle elevator bookings, loading bays and walk-ups.' },
      { href: '/locations/vancouver', label: 'City of Vancouver Movers', text: 'Downtown, Yaletown, West End and East Van moves.' },
      { href: '/pricing/moving', label: 'Moving Rates', text: 'Hourly rates for 2 and 3 movers, and a quick estimate by home size.' },
    ],
  },

  {
    slug: 'office-relocation-checklist',
    title: 'Office Relocation Checklist: How to Plan an Office Move in Vancouver',
    metaTitle: 'Office Relocation Checklist: How to Plan an Office Move',
    description: 'Office relocation checklist for Vancouver businesses: moving timeline, labelling, IT, minimizing downtime and who to notify of your new address in BC.',
    keywords: [
      "office relocation checklist",
      "office move checklist",
      "how to plan an office move",
      "office relocation Vancouver",
      "office moving timeline",
      "business relocation checklist",
      "how to minimize downtime during an office move",
      "labelling for an office move",
      "change business address BC",
      "office IT relocation checklist",
    ],
    takeaways: [
      "Start 6 to 8 weeks ahead with the new floor plan and an inventory of everything that moves.",
      "Book the freight elevators and loading docks at both buildings, and schedule the move after close or on a weekend.",
      "Number every workstation on the floor plan and label each desk, chair, box and device with that number.",
      "Disconnect IT the day before, set up to the plan, and test before staff arrive.",
      "After the move, update your address with the CRA, BC Registries, your city business licence, Google Business Profile and your website.",
    ],
    short: 'Office relocation checklist',
    answer: 'Start with the new floor plan and an inventory of everything that moves. Book the elevators and loading docks at both buildings, schedule the move outside business hours, and give every desk, chair and box a label that matches a spot on the new plan. Disconnect IT the day before, move after close, set up to the plan and test before staff arrive the next morning.',
    hero: { src: '/guides/vancouver-downtown-office-tower.jpg', alt: 'A glass office tower at Bentall Centre in downtown Vancouver', pos: 'center 30%', credit: BENTALL_CREDIT },
    published: '2026-11-08',
    updated: '2026-11-08',
    reviewed: '2026-11-08',
    body: [
      { type: 'h2', id: 'six-weeks', text: 'Office relocation timeline: 6 to 8 weeks before' },
      { type: 'checklist', items: [
        'Get the new floor plan and mark where every team, desk, cabinet and printer goes.',
        'Make an inventory of what is moving, what is being replaced and what is being disposed of or donated.',
        'Read the move rules for both buildings: elevator bookings, loading dock times, after-hours access and insurance requirements.',
        'Ask both building managers whether movers must provide a certificate of insurance, and to whom.',
        'Bring in your IT provider early: internet at the new address, phones, network cabling and when equipment can be disconnected.',
        'Pick one person who makes decisions on moving day and give the movers their number.',
      ] },
      { type: 'h2', id: 'four-weeks', text: '3 to 4 weeks before: book the movers, elevators and loading docks' },
      { type: 'checklist', items: [
        'Book the movers for a time outside business hours, usually after close on a Friday or over a weekend.',
        'Reserve the freight elevator and loading dock at both buildings for the same window.',
        'Tell staff the timeline: when to pack their desk, what to take home, and when they start at the new office.',
        'Tell clients and suppliers the new address and the date it takes effect, and arrange mail forwarding.',
        'Order boxes, labels and crates. Book [packing services](/packing-services) if files, supplies or a kitchen need packing for you.',
      ] },
      { type: 'h2', id: 'labelling', text: 'How to label desks and equipment for an office move' },
      { type: 'p', text: 'Labels are what let a crew set up a floor without asking where things go. Give every workstation a number on the new floor plan and use that number on everything that belongs to it.' },
      { type: 'quote', text: 'Labels are what let a crew set up a floor without asking where things go.' },
      { type: 'table', head: ['Item', 'Label with', 'Tip'], rows: [
        ['Desk', 'Workstation number, e.g. 2-14 (floor 2, desk 14)', 'Put the label on the top and the side, so it is visible when stacked.'],
        ['Chair', 'Same workstation number', 'Chairs get mixed up first. Label the back of the seat.'],
        ['Boxes from a desk', 'Workstation number and the person\'s name', 'One person, one colour of tape, if teams are large.'],
        ['Monitors and computers', 'Workstation number, plus "IT"', 'Bag and label cables with the device they belong to.'],
        ['Shared rooms', 'Room name from the new plan, e.g. "Boardroom" or "Kitchen"', 'Tape a copy of the plan at the new entrance and on each floor.'],
        ['Do not move', 'A clear "STAYS" label', 'Anything left for the landlord or disposal is labelled, not assumed.'],
      ] },
      { type: 'h2', id: 'downtime', text: 'How to minimize downtime during an office move' },
      { type: 'list', items: [
        'Pack desks on the last afternoon and keep one or two people working on laptops until close.',
        'Disconnect and pack computers the evening before or at close, with cables bagged per device.',
        'Move furniture first, then boxes, so desks are standing when the boxes arrive at each spot.',
        'Have the crew set up to the floor plan: desks, chairs and boardroom tables placed, not just dropped.',
        'Reconnect and test IT before anyone arrives the next morning.',
      ] },
      { type: 'image', src: '/burnaby/burnaby-move-crew-loading.jpg', alt: 'Two Stonegate movers loading the truck in the evening, one inside the truck and one on the ramp with a hand truck', caption: 'Evening loading. After-hours moves keep the office open during the working day.', portrait: true },
      { type: 'h2', id: 'moving-day', text: 'Office moving day checklist' },
      { type: 'checklist', items: [
        'Confirm elevator and dock bookings with both buildings in the morning.',
        'Walk the crew lead through the old office: what moves, what stays, what is fragile.',
        'Have the decision maker at the new office with the floor plan when the first load arrives.',
        'Check every workstation against the plan before the crew leaves.',
        'Do a last walk-through of the old space so nothing is left behind.',
      ] },
      { type: 'h2', id: 'notify', text: 'Who to notify when your business moves in BC' },
      { type: 'p', text: 'A new office means a new business address, and several records have to follow it. Most can be updated online.' },
      { type: 'table', head: ['Who', 'What to update', 'How'], rows: [
        ['Canada Revenue Agency', 'Mailing, physical and books-and-records addresses', 'Online in My Business Account, with the Manage address service.'],
        ['BC Registries', 'Registered and records office addresses of a BC company', 'File a change of address for the company with BC Registries.'],
        ['Your city\'s licence office', 'The address on your business licence', 'In Vancouver, update your business licence information with the City. Check zoning for the new space before you sign the lease.'],
        ['Google Business Profile', 'Address, map pin and hours', 'Update it on the day you open, so customers and search results find the new office.'],
        ['Your website and directories', 'Address in the footer, contact page and listings', 'Keep the name, address and phone identical everywhere.'],
        ['Banks, insurers, suppliers and clients', 'Billing, delivery and policy addresses', 'Send one notice with the new address and the date it takes effect.'],
      ] },
      { type: 'callout', tone: 'crew', title: 'How we handle office moves', text: 'We take desks, chairs, filing cabinets and boardroom tables apart where needed, wrap them, and set them up to your floor plan at the new space. Send us the plan before moving day and have one person on site who can answer "where does this go?".' },
    ],
    faqs: [
      { q: 'How far in advance should you plan an office relocation?', a: 'Six to eight weeks ahead is comfortable for a small office. It leaves time for building bookings, IT setup at the new address and telling staff and clients.' },
      { q: 'How do you minimize downtime during an office move?', a: 'Move after close or over a weekend, pack desks on the last afternoon, disconnect IT at close, and have the movers set up to the new floor plan so you can reconnect and test before staff arrive.' },
      { q: 'Who do I notify when my business changes address in BC?', a: 'The CRA (My Business Account), BC Registries for a BC company\'s registered and records office, your city\'s business licence office, your Google Business Profile and website, and your bank, insurer, suppliers and clients.' },
      { q: 'Do I need to update my business licence if I move my office in Vancouver?', a: 'Yes. The address on a City of Vancouver business licence has to be updated, and the new location has to meet zoning, so check zoning before you sign the lease.' },
      { q: 'Can the move happen after business hours?', a: 'Yes. Most office moves are scheduled after close or on a weekend so the business keeps working. Book the elevators and loading docks at both buildings for the same window.' },
      { q: 'Do movers set up the desks?', a: 'We take apart, move and set up desks, chairs and boardroom tables to your new floor plan. Computers and network equipment should be disconnected and reconnected by your IT provider.' },
    ],
    sources: [
      { label: 'Canada Revenue Agency: Maintain your business (change a business address)', href: 'https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/changes-your-business.html' },
      { label: 'BC Registries: Corporate registry forms and fees (change of address)', href: 'https://www2.gov.bc.ca/gov/content/employment-business/business/managing-a-business/permits-licences/businesses-incorporated-companies/corporate-forms' },
      { label: 'City of Vancouver: Update information on your business licence account', href: 'https://vancouver.ca/doing-business/update-information-on-your-business-licence-account.aspx' },
    ],
    related: [
      { href: '/office-moving', label: 'Office Moving', text: 'Desks, workstations and boardrooms moved and set up to your floor plan.' },
      { href: '/commercial-moving', label: 'Commercial Moving', text: 'Stores, showrooms, studios and employee relocation.' },
      { href: '/pricing/moving', label: 'Moving Rates', text: 'Hourly rates for 2 and 3 movers, with a 3-hour minimum.' },
    ],
  },

  {
    slug: 'how-long-does-it-take-to-move-a-house',
    title: 'How Long Does It Take to Move a House in Vancouver?',
    metaTitle: 'How Long Does It Take to Move a House? Times by Home Size',
    description: 'How long a move takes by home size: 1-bedroom 3 to 6 hours, 2-bedroom 4 to 9 hours, bigger homes 6 hours to a full day, and how many movers you need.',
    keywords: [
      "how long does it take to move a house",
      "how long does a move take",
      "how long does it take to move a 1 bedroom apartment",
      "how long does it take to move a 2 bedroom apartment",
      "how long does it take to move a 3 bedroom house",
      "how many movers do I need",
      "how many movers for a 3 bedroom house",
      "how long do movers take Vancouver",
      "moving time estimate",
      "what makes a move take longer",
    ],
    takeaways: [
      "1-bedroom: 3 to 6 hours on average with 2 movers.",
      "2-bedroom apartment: 4 to 9 hours on average with 2 movers.",
      "Anything bigger: 3 movers and a 26 ft truck, about 6 hours to a full day.",
      "Access decides where you land in the range: stairs, elevators, packing and how close the truck parks.",
      "Parking the truck even 10 metres further away lengthens every trip, at both homes.",
    ],
    short: 'How long does moving take?',
    answer: 'With 2 movers, a 1-bedroom move takes 3 to 6 hours on average and a 2-bedroom 4 to 9 hours. For anything bigger than a 2-bedroom apartment we recommend 3 movers and our 26 ft truck, and those moves run from about 6 hours to a full day. Where your move lands in the range depends on access more than on size: stairs, the elevator, how far the truck parks from the door and whether everything is packed.',
    hero: { src: '/hero-truck-home-natural.jpg', alt: 'The Stonegate moving truck parked in the driveway of a house in Metro Vancouver', pos: '70% center' },
    published: '2026-11-08',
    updated: '2026-11-08',
    reviewed: '2026-11-08',
    body: [
      { type: 'h2', id: 'by-size', text: 'How long does a move take? Average times by home size' },
      { type: 'table', head: ['Home', 'Recommended crew', 'Truck', 'Average time'], rows: [
        ['Studio', '2 movers', 'Moving truck', 'Usually close to the 3-hour minimum'],
        ['1 bedroom', '2 movers', 'Moving truck', '3 to 6 hours'],
        ['2-bedroom apartment', '2 movers', 'Moving truck', '4 to 9 hours'],
        ['Anything bigger: 3+ bedrooms, houses and larger townhouses', '3 movers', '26 ft truck', 'About 6 hours to a full day'],
      ], caption: 'Averages from our own moves within Metro Vancouver. The ranges are wide on purpose: the same home size can be an easy move or a hard one, as explained below.' },
      { type: 'p', text: 'The low end of each range is a move with everything packed, an elevator or ground-floor entrance at both ends and the truck parked right outside. The high end is the same home with stairs, a shared elevator, a long carry from the truck or packing still to do on the day. Bigger homes vary the most: a 3-bedroom house with a driveway can finish in 6 hours, while a 4-bedroom with stairs, a full garage and a tight street can take the whole day.' },
      { type: 'h3', text: 'How long does it take to move a 1-bedroom apartment?' },
      { type: 'p', text: '3 to 6 hours on average with 2 movers. Closer to 3 hours with everything packed, an elevator booked and the truck at the door; closer to 6 with a walk-up, a shared elevator or a long carry.' },
      { type: 'h3', text: 'How long does it take to move a 2-bedroom apartment?' },
      { type: 'p', text: '4 to 9 hours on average with 2 movers. The range is wide because a 2-bedroom can be a ground-floor suite or a top-floor walk-up, with or without packing left to do.' },
      { type: 'h3', text: 'How long does it take to move a 3-bedroom house?' },
      { type: 'p', text: 'With 3 movers and our 26 ft truck, about 6 hours to a full day. A house with a driveway and everything packed sits at the low end; stairs, a full garage, a basement or a tight street push it towards a full day. Bigger homes take longer still.' },

      { type: 'h2', id: 'how-many-movers', text: 'How many movers do I need?' },
      { type: 'list', items: [
        '**Studio, 1-bedroom or 2-bedroom apartment: 2 movers.** Two people can carry everything in a home this size, and a third would often wait for the elevator or the doorway.',
        '**Anything bigger than a 2-bedroom apartment: 3 movers and our 26 ft truck.** That covers 3-bedroom homes and up, houses and larger townhouses. More furniture, more rooms and usually a garage or storage room mean more trips, and one bigger truck avoids a second run.',
      ] },
      { type: 'p', text: 'We run two trucks, a 16 ft and a 26 ft, and send the one that fits your move, so everything goes in one trip.' },
      { type: 'p', text: 'A third mover often costs less overall, not more. At $170/hr for 3 movers against $130/hr for 2, the bigger crew is cheaper as soon as it finishes about a quarter faster, and on bigger homes it usually does. Compare both crews and get a quick estimate on the [moving rates](/pricing/moving) page.' },

      { type: 'h2', id: 'truck-distance', text: 'Why truck parking distance changes your moving time' },
      { type: 'p', text: 'A move is not one long carry. It is dozens to hundreds of round trips between your door and the truck: every box, chair, lamp and mattress goes out and the mover walks back for the next one. Then the same trips happen again at the new home. That is why a small change in distance has a big effect on time.' },
      { type: 'quote', text: 'If the truck parks just 10 metres further away, every round trip gets 20 metres longer, at both addresses, for every item in your home.' },
      { type: 'callout', tone: 'tip', title: 'Even 10 metres matters', text: 'Ten extra metres sounds like nothing, but it repeats on every trip, at both homes. Over a full move that adds up to a noticeable amount of extra time on the bill, which makes a reserved loading bay or a legal spot right at the entrance one of the cheapest ways to shorten your move.' },
      { type: 'checklist', items: [
        'Reserve the loading bay at both buildings, or the closest legal parking to the entrance.',
        'Tell us if the truck cannot get close: underground parking with low clearance, a narrow lane, a long driveway or a complex with no visitor parking.',
        'In the City of Vancouver, metered or restricted street space can be reserved with a temporary street occupancy permit. See our [condo moving checklist](/guides/vancouver-condo-moving-checklist) for how.',
        'Move your own cars out of the driveway and the spot in front of the door the night before.',
      ] },

      { type: 'image', src: '/crew-wrapping-furniture.jpg', alt: 'A Stonegate mover inside the truck placing blanket-wrapped furniture against the wall', caption: 'Inside the truck: every wrapped piece is a separate trip from the door, so the distance from the entrance to the ramp repeats on every one.', portrait: true },

      { type: 'h2', id: 'what-adds-time', text: 'What makes a move take longer?' },
      { type: 'table', head: ['Condition', 'Why it adds time', 'What helps'], rows: [
        ['Stairs or a walk-up', 'Every piece is carried by hand, floor by floor, at one or both ends. Each extra flight slows every trip.', 'Tell us the floor and the number of stairs at both addresses when you book.'],
        ['Shared or small elevator', 'Waiting for the elevator between loads, or many small trips in a small cab.', 'Book the elevator on service mode for your move window.'],
        ['Short elevator booking', 'If the booking ends before the last load, the move stops until it is extended.', 'Book a longer window, or choose 3 movers so the move fits.'],
        ['Long hallways and lobbies', 'Some buildings have a long walk from the elevator to the loading bay or the door.', 'Mention it when booking, so the crew size fits.'],
        ['Boxes not packed', 'Packing on the day is slower than carrying, and loose items, open bins and bags cannot be stacked.', 'Pack and close everything before we arrive, or book [packing services](/packing-services).'],
        ['Furniture to take apart', 'Bed frames, tables, wardrobes and some desks are taken apart, then rebuilt at the new home.', 'List them when booking so the time is planned in.'],
        ['Heavy or awkward items', 'Pianos, safes, large sectionals and appliances need more people, more care and sometimes extra equipment.', 'Tell us in advance. Some items are covered by [specialty moving](/specialty-moving).'],
        ['Garage, storage locker, shed, balcony', 'Often the fullest spaces in a home, and the ones people forget to mention.', 'Include them in your list, not just the bedrooms.'],
        ['Distance and traffic between homes', 'The clock keeps running during the drive, and bridges, tunnels and rush hour change it.', 'Morning starts usually beat afternoon traffic.'],
        ['Extra stops', 'A storage unit or a second address adds a stop, a load and an unload.', 'Tell us about every stop when booking.'],
        ['Items not on the list', 'Extra furniture on the day can mean the truck fills up before the end.', 'Send a complete list so we bring the right truck.'],
        ['Building not ready', 'No fob or key, an elevator not reserved, or the previous resident still moving out.', 'Confirm keys and bookings with both buildings the day before.'],
        ['Rain', 'More wrapping for furniture and more care on wet ramps and floors.', 'Have the entrance clear and a spot inside for boxes.'],
      ] },

      { type: 'h2', id: 'cost', text: 'How moving time affects the cost' },
      { type: 'table', head: ['Home', 'Crew and rate', 'At average time'], rows: [
        ['1 bedroom', '2 movers, $130/hr', '$390 to $780 for 3 to 6 hours'],
        ['2-bedroom apartment', '2 movers, $130/hr', '$520 to $1,170 for 4 to 9 hours'],
        ['Bigger homes', '3 movers + 26 ft truck, $170/hr', 'From $1,020 for 6 hours, more for a full day'],
      ], caption: 'Plus GST and a one-time flat travel fee. 3-hour minimum. Your actual cost depends on the hours worked.' },
      { type: 'p', text: 'The clock starts when the crew arrives at your pickup address and stops when the last piece is in place at the new home. The drive to you and back is covered by the one-time travel fee, which we explain before you book.' },

      { type: 'h2', id: 'faster', text: 'How to make your move faster' },
      { type: 'checklist', items: [
        'Get the truck as close to the entrance as possible at both addresses.',
        'Book the elevator, on service mode, for long enough at both buildings.',
        'Have every box packed, taped and stacked near the door before the crew arrives.',
        'Take apart what you can yourself, and keep the screws in a labelled bag.',
        'Label boxes by room so unloading never stops for questions.',
        'Send a full list when you book, including the garage, storage and balcony.',
        'Choose 3 movers for anything bigger than a 2-bedroom apartment.',
      ] },
      { type: 'callout', tone: 'crew', title: 'How we plan a move', text: 'We recommend the crew and truck from your home size and the access at both addresses: floors, stairs, elevators and where the truck can park. The more of that you tell us when you book, the closer the plan is to the real moving day.' },
    ],
    faqs: [
      { q: 'How long does it take to move a 1-bedroom apartment?', a: '3 to 6 hours on average with 2 movers. It is at the low end when everything is packed and the truck parks at the door, and at the high end with stairs, elevator waits or a long carry.' },
      { q: 'How long does a 2-bedroom move take?', a: '4 to 9 hours on average with 2 movers, depending on the access at both addresses and how much is packed.' },
      { q: 'How many movers do I need for a 3-bedroom house?', a: 'We recommend 3 movers and our 26 ft truck for anything bigger than a 2-bedroom apartment. These moves take from about 6 hours to a full day, depending on stairs, distance and how much is moving.' },
      { q: 'How many movers do I need for a 2-bedroom apartment?', a: 'Two movers. We recommend a third mover only for homes bigger than a 2-bedroom apartment.' },
      { q: 'How long does it take to move a 4-bedroom house?', a: 'Expect the upper end of the 6-hours-to-a-full-day range with 3 movers and our 26 ft truck, especially with stairs, a full garage or a long carry from the truck. Send us a full list for a closer estimate.' },
      { q: 'Does it matter where the truck parks?', a: 'Yes, a lot. Every item is a round trip between the door and the truck, at both homes. If the truck parks even 10 metres further away, every trip gets longer and the move can take noticeably more time.' },
      { q: 'When does the clock start?', a: 'When the crew arrives at your pickup address. It stops when the last piece is in place at the new home.' },
    ],
    related: [
      { href: '/residential-moving', label: 'Residential Moving', text: 'House and townhouse moves across Metro Vancouver.' },
      { href: '/pricing/moving', label: 'Moving Rates', text: 'Hourly rates for 2 and 3 movers, and a quick estimate by home size.' },
      { href: '/packing-services', label: 'Packing Services', text: 'Have it boxed before the crew arrives.' },
    ],
  },
  {
    slug: '2-vs-3-movers',
    title: '2 vs. 3 Movers: Which Is More Cost-Effective?',
    metaTitle: '2 vs 3 Movers: Which Is Cheaper? The Break-Even Math',
    description: 'Is a third mover worth it? The break-even math with real Vancouver rates, why 3 movers can never be cheaper on short moves, and when a bigger crew saves you money.',
    keywords: [
      "2 vs 3 movers",
      "is it worth getting 3 movers",
      "how many movers do I need",
      "2 movers or 3 movers",
      "are 3 movers faster than 2",
      "how many movers for a 2 bedroom apartment",
      "how many movers for a 3 bedroom house",
      "cost of 3 movers vs 2 movers",
      "hourly movers Vancouver cost",
      "how to save money on movers",
    ],
    takeaways: [
      "At $130/hr for 2 movers and $170/hr for 3, the third mover adds $40 an hour: 50% more people for 31% more money.",
      "3 movers are cheaper overall once they finish at least about 24% faster than 2 would.",
      "With a 3-hour minimum, 3 movers cost at least $510, so for any move 2 movers finish in under about 4 hours, 2 is always cheaper.",
      "The third mover pays off most on bigger homes, with heavy two-person furniture, and when an elevator booking has a hard end time.",
      "Every minute of driving between homes costs more with 3 movers on the clock, and nobody is carrying anything.",
    ],
    short: '2 or 3 movers?',
    answer: 'For a studio, a 1-bedroom or a 2-bedroom apartment, 2 movers are usually the cheaper choice. For anything bigger, 3 movers usually cost less overall even at a higher hourly rate. With our rates, 2 movers at $130/hr and 3 at $170/hr, the third mover adds $40 an hour, so the bigger crew wins as soon as it finishes about a quarter faster. It cannot win on short moves: with the 3-hour minimum, 3 movers cost at least $510, which 2 movers only reach after almost 4 hours of work.',
    hero: { src: '/about/photo-3.jpg', alt: 'Three Stonegate movers standing in front of the moving truck', pos: 'center 60%' },
    published: '2026-11-14',
    updated: '2026-11-14',
    reviewed: '2026-11-14',
    body: [
      { type: 'h2', id: 'third-mover-cost', text: 'What a third mover actually costs' },
      { type: 'p', text: 'Most people compare the two hourly rates and stop there: $170 is more than $130, so 3 movers must be more expensive. The more useful number is the difference. The truck, the equipment and the travel fee are there either way, so the third mover adds **$40 an hour**.' },
      { type: 'table', head: ['', '2 movers', '3 movers'], rows: [
        ['Hourly rate', '$130/hr', '$170/hr'],
        ['Cost per mover per hour', '$65', 'about $57'],
        ['What the extra mover adds', '', '+$40/hr, +31% cost, +50% people'],
        ['Minimum charge (3 hours)', '$390', '$510'],
      ], caption: 'Our rates, plus GST. Both crews come with a fully equipped truck and the same one-time travel fee.' },
      { type: 'p', text: 'So the question is not "is $170 more than $130?" but "does one more person speed the move up by more than the 31% they add to the rate?" A third person is 50% more hands, so they have room to spare, but only when the move has enough work to keep three people busy.' },
      { type: 'quote', text: 'The third mover adds 50% more people for 31% more money. On a big move, that is the cheapest hour you can buy.' },

      { type: 'h2', id: 'break-even', text: 'The break-even: when 3 movers are cheaper than 2' },
      { type: 'p', text: '3 movers cost less overall when they finish in **76% or less of the time 2 movers would take**, which means at least about 24% faster. The table turns that into hours.' },
      { type: 'table', head: ['If 2 movers would take', '2 movers cost', '3 movers are cheaper if they finish within'], rows: [
        ['3 hours', '$390', 'Never: 3 movers cost at least $510'],
        ['4 hours', '$520', 'About 3 hours (the minimum)'],
        ['5 hours', '$650', '3 h 49 min'],
        ['6 hours', '$780', '4 h 35 min'],
        ['7 hours', '$910', '5 h 21 min'],
        ['8 hours', '$1,040', '6 h 7 min'],
        ['10 hours', '$1,300', '7 h 39 min'],
      ], caption: 'Labour only, before GST and the travel fee, which are the same for both crews. Rates: $130/hr for 2 movers, $170/hr for 3.' },
      { type: 'p', text: 'Two things stand out. On short moves the 3-hour minimum decides it: a third mover cannot save money on a move 2 people finish in under about 4 hours, however fast they are. On long moves the margin grows: an 8-hour job only has to drop by under 2 hours for the third mover to pay for themselves, and on a big house that is a small ask.' },

      { type: 'h2', id: 'why-faster', text: 'Why 3 movers are faster than 2 on big moves' },
      { type: 'p', text: 'A third mover is not just one more pair of arms. It changes how the crew works.' },
      { type: 'list', items: [
        '**Two-person pieces stop the whole crew of 2.** A sofa, dresser, fridge or washer needs two people. With a crew of 2, every one of those pieces means nobody else is carrying, wrapping or loading. With 3, two carry the big piece while the third keeps boxes moving.',
        '**Someone can stay in the truck.** With 2 movers, both carry and both stack, so they climb in and out of the truck all day. With 3, one person can build the load inside the truck while the other two keep bringing pieces. A well-built load is also tighter, which matters when the home only just fits the truck.',
        '**Wrapping and taking apart happen in parallel.** Bed frames, tables and wardrobes have to be taken apart and every piece of furniture wrapped. With 3, that work runs alongside the carrying instead of in between.',
        '**Elevator trips get fuller.** In a condo, a crew of 3 can fill the cab on every trip while the next load is staged at the elevator door.',
      ] },
      { type: 'image', src: '/crew-loading-ramp.jpg', alt: 'Stonegate movers carrying wrapped furniture up the truck ramp', caption: 'Big wrapped pieces take two people. With a crew of 3, the third keeps the rest of the move going while they carry.' },

      { type: 'h2', id: 'when-2-wins', text: 'When 2 movers are the better deal' },
      { type: 'list', items: [
        '**Small homes.** Studios, 1-bedrooms and most 2-bedroom apartments. There is not enough work for three people, and the 3-hour minimum makes the third mover expensive.',
        '**One narrow staircase.** If only one person can use the stairs at a time, a third mover often waits on the landing instead of carrying.',
        '**A small, shared elevator with no booking.** When the elevator is the slowest part of the move, more people do not make it come faster.',
        '**Long drives between homes.** The clock runs while the truck drives, and nobody is carrying. A 30-minute drive costs $65 with 2 movers and $85 with 3; a full hour costs $40 more with 3. On a long-distance day, that adds up.',
        '**Mostly boxes, little furniture.** Boxes are one-person carries, so a two-person crew rarely has to stop and wait for each other.',
      ] },

      { type: 'h2', id: 'when-3-wins', text: 'When 3 movers save you money' },
      { type: 'list', items: [
        '**Anything bigger than a 2-bedroom apartment.** 3-bedroom homes, houses and larger townhouses have the volume to keep three people busy all day. This is what we recommend, with our 26 ft truck.',
        '**Heavy furniture.** Sectionals, dressers, solid wood tables, appliances: every two-person piece is where a crew of 2 loses time.',
        '**A hard end time.** If the strata gives you a fixed elevator window, a crew that runs over means a second booking, a second move day or extra fees. A bigger crew is insurance. See our [condo moving checklist](/guides/vancouver-condo-moving-checklist) for how elevator bookings work.',
        '**Garages, basements and storage rooms.** These are the spaces people forget to count, and they are often packed full of heavy, awkward things.',
        '**A same-day handover.** If you have to be out by a set time, or the new place is only available from a set time, the faster crew is the safer choice.',
      ] },
      { type: 'callout', tone: 'crew', title: 'What we recommend', text: 'We suggest 2 movers for studios, 1-bedrooms and 2-bedroom apartments, and 3 movers for anything bigger. When a smaller home has stairs at both ends, heavy furniture or a tight elevator window, we may suggest a third mover there too. Tell us the floors, the elevator booking and the biggest pieces when you book, and we will tell you which crew makes sense.' },

      { type: 'h2', id: 'examples', text: 'Three examples' },
      { type: 'h3', text: 'A 1-bedroom condo with an elevator booked at both ends' },
      { type: 'p', text: 'This is a typical 2-mover move. If it takes 2 movers about 4 hours ($520), 3 movers would have to finish in about 3 hours just to match, and a 1-bedroom rarely has enough work for that. **2 movers.**' },
      { type: 'h3', text: 'A 2-bedroom walk-up on the third floor with a heavy sofa and a solid wood dresser' },
      { type: 'p', text: 'Stairs at one end and two heavy pieces. Every trip down the stairs is slower, and the heavy pieces stop a crew of 2 each time. If 2 movers would take 7 hours ($910), 3 movers need to finish within 5 h 21 min. That is plausible but not certain, so this is the one to ask us about with the details. **It depends: tell us the floors and the big pieces.**' },
      { type: 'h3', text: 'A 4-bedroom house with a full garage' },
      { type: 'p', text: 'Plenty of work for three people, lots of two-person furniture and a garage nobody has emptied in years. If 2 movers would take 10 hours ($1,300), 3 movers only need to finish within 7 h 39 min to be cheaper, and they also finish in daylight. **3 movers and the 26 ft truck.**' },

      { type: 'h2', id: 'cut-cost', text: 'How to spend less, whichever crew you book' },
      { type: 'checklist', items: [
        'Pack and close every box before the crew arrives. Packing on the day is slower than carrying.',
        'Take apart what you can yourself and keep the screws in a labelled bag.',
        'Get the truck parked as close to the entrance as possible at both addresses.',
        'Book the elevator, on service mode, at both buildings.',
        'Send a complete list, including the garage, storage locker and balcony, so the crew and truck fit the move.',
        'Stack boxes near the door, and keep pets and kids clear of the route.',
      ] },
      { type: 'p', text: 'For how long each home size usually takes, see [how long it takes to move a house](/guides/how-long-does-it-take-to-move-a-house).' },
    ],
    faqs: [
      { q: 'Is it worth paying for 3 movers instead of 2?', a: 'On bigger moves, usually yes. With our rates, the third mover adds $40 an hour, so 3 movers are cheaper overall once they finish at least about 24% faster than 2. On homes bigger than a 2-bedroom apartment they usually do. On small moves they cannot, because of the 3-hour minimum.' },
      { q: 'Are 3 movers faster than 2?', a: 'On bigger homes, yes. With 3, two people can carry heavy pieces while the third keeps boxes moving or builds the load in the truck. On small homes, one narrow staircase or a slow shared elevator, the third mover often waits, so the gain is small.' },
      { q: 'How many movers do I need for a 2-bedroom apartment?', a: 'Usually 2. A third mover may make sense with stairs at both ends, very heavy furniture or a short elevator booking.' },
      { q: 'How many movers do I need for a 3-bedroom house?', a: 'We recommend 3 movers and our 26 ft truck for any home bigger than a 2-bedroom apartment.' },
      { q: 'Why can 3 movers never be cheaper on a short move?', a: 'Because of the 3-hour minimum. 3 movers cost at least $510 (3 hours at $170). 2 movers only reach $510 after almost 4 hours of work, so for any move 2 movers would finish in less than that, 2 is always cheaper.' },
      { q: 'Does the travel fee change with the crew size?', a: 'The travel fee covers the truck\'s drive to your pickup and back from your drop-off, and we tell you the exact amount before you book. The drive between your two homes is part of the move and is charged at the hourly rate of the crew you book.' },
    ],
    sources: [
      { label: 'Stonegate Moving Solutions: Moving rates', href: 'https://www.stonegatemoving.com/pricing/moving' },
    ],
    related: [
      { href: '/pricing/moving', label: 'Moving Rates', text: 'Both crews, the 3-hour minimum and how the travel fee works.' },
      { href: '/guides/how-long-does-it-take-to-move-a-house', label: 'How Long Does a Move Take?', text: 'Average times by home size.' },
      { href: '/residential-moving', label: 'Residential Moving', text: 'House and townhouse moves with a crew of 3.' },
      { href: '/apartment-moving', label: 'Apartment & Condo Moving', text: 'Studios to three-bedroom suites, around elevator bookings.' },
    ],
  },
  {
    slug: 'what-size-moving-truck-do-i-need',
    title: 'What Size Moving Truck Do You Need?',
    metaTitle: 'What Size Moving Truck Do I Need? 16 ft vs 26 ft',
    description: 'Which moving truck fits your home: what a 16 ft and a 26 ft truck really hold, why two "16 ft" trucks can differ by 140 cubic feet, what fits under a 6.5 ft ceiling, and when a bigger truck saves money.',
    keywords: [
      "what size moving truck do I need",
      "moving truck size guide",
      "16 ft moving truck",
      "26 ft moving truck",
      "what fits in a 16 ft moving truck",
      "16 ft truck vs 26 ft truck",
      "moving truck cubic feet",
      "moving truck size for 2 bedroom apartment",
      "moving truck size for 3 bedroom house",
      "will a king mattress fit in a moving truck",
    ],
    takeaways: [
      "Studio to 2-bedroom apartment: a 16 ft truck. Anything bigger: a 26 ft truck.",
      "\"16 ft\" is the length, not the size: our 16 ft box holds 780 cubic feet, and some rental 16 ft trucks hold about 660.",
      "Inside height decides what stands upright. Under our 6.5 ft (78 in) ceiling, a king mattress fits on its long edge, not on its end.",
      "One bigger truck almost always beats two trips: the second trip puts the drive between homes on the clock twice more.",
      "In Metro Vancouver, access matters as much as size: underground parkades are usually too low for a moving truck, so book the loading bay or street space.",
    ],
    short: 'Which truck size?',
    answer: 'For a studio, 1-bedroom or 2-bedroom apartment, a 16 ft truck is usually enough. For anything bigger, such as a 3-bedroom home, a house or a larger townhouse, you want a 26 ft truck so everything goes in one trip. Our 16 ft truck has a box of 16 × 7.5 × 6.5 ft inside, 780 cubic feet, and a 26 ft box truck holds roughly twice that. When you hire movers, they choose the truck; your job is to give them a complete list, including the garage, storage and balcony.',
    hero: { src: '/crew-walking-truck.jpg', alt: 'A Stonegate mover walking a dolly beside the moving truck', pos: 'center 55%' },
    published: '2026-11-14',
    updated: '2026-11-14',
    reviewed: '2026-11-14',
    body: [
      { type: 'h2', id: 'by-home-size', text: 'Moving truck size by home size' },
      { type: 'table', head: ['Home', 'Truck', 'Crew'], rows: [
        ['Studio', '16 ft', '2 movers'],
        ['1 bedroom', '16 ft', '2 movers'],
        ['2-bedroom apartment', '16 ft', '2 movers'],
        ['Anything bigger: 3+ bedrooms, houses, larger townhouses', '26 ft', '3 movers'],
      ], caption: 'What we send for moves within Metro Vancouver. A 2-bedroom with a full storage locker or a garage can be the exception, which is why we ask for a complete list.' },
      { type: 'p', text: 'Bedrooms are only a shortcut. What fills a truck is furniture, and the rooms people forget: the storage locker, the balcony, the garage and the space under the stairs. A sparsely furnished 3-bedroom can hold less than a 2-bedroom that has been lived in for ten years.' },

      { type: 'h2', id: '16-ft', text: 'What a 16 ft moving truck really holds' },
      { type: 'p', text: 'Our 16 ft truck has a box of **16 ft long, 7.5 ft wide and 6.5 ft high inside**. That is 780 cubic feet, or about 29 cubic yards, with a flat floor from the door to the front wall.' },
      { type: 'image', src: '/truck-dimensions.jpg', alt: 'Illustration of a 16 ft moving truck box with its inside dimensions: 16 ft long, 7.5 ft wide and 6.5 ft high', caption: 'Illustration of our 16 ft truck\'s box: 16 ft long, 7.5 ft wide and 6.5 ft high inside, 780 cubic feet in all.' },
      { type: 'p', text: 'The length in a truck\'s name tells you less than you would think. Rental companies publish very different boxes under the same "16 ft" label: one lists about 658 cubic feet, another up to 800. Ours sits near the top of that range, about 120 cubic feet more than the smallest. That is roughly 40 medium moving boxes. If you are comparing quotes, or renting a truck yourself, ask for the inside dimensions, not just the length.' },
      { type: 'table', head: ['Truck', 'Inside (L × W × H)', 'Volume'], rows: [
        ['Our 16 ft truck', '16 × 7.5 × 6.5 ft', '780 cu ft'],
        ['A rental 16 ft (Budget, as listed)', '16 ft × 6 ft 3 in × 6 ft 7 in', 'about 658 cu ft'],
        ['A rental 16 ft (Penske, as listed)', 'up to 16 ft × 7 ft 7 in', 'up to 800 cu ft'],
        ['A rental 26 ft (U-Haul, as listed)', '26 ft 2 in × 8 ft 1 in × 8 ft 3 in', 'about 1,682 cu ft'],
      ], caption: 'Rental figures as published by each company or reported by U-Pack; see the sources below. Models and figures change, so check the truck you are actually getting.' },
      { type: 'h3', text: 'A quick way to picture 780 cubic feet' },
      { type: 'p', text: 'A medium moving box is about 3 cubic feet. 100 medium boxes are about 300 cubic feet, close to 40% of our 16 ft box, before a single piece of furniture goes in. In practice furniture never fills a box perfectly: legs, arms and odd shapes leave gaps that only careful stacking recovers. That is why a crew that builds the load well, floor to ceiling and in tiers, gets far more into the same truck.' },

      { type: 'image', src: '/truck-bed-loaded.jpg', alt: 'Inside a Stonegate moving truck: wood-lined walls with tie-down rings, flat boxes and pallets loaded on the floor', caption: 'Inside one of our trucks. Tie-down points along the walls let the crew strap each section of the load as it goes in, so nothing shifts on the road.', portrait: true },

      { type: 'h2', id: 'height', text: 'Inside height: what stands up, and what has to lie down' },
      { type: 'p', text: 'Length tells you how much fits. Height tells you how it fits. Our 16 ft box is 6.5 ft, or 78 inches, high inside. Most furniture travels standing up, because that is how it takes the least floor space, so the ceiling matters more than people expect.' },
      { type: 'table', head: ['Item', 'Size', 'Under a 78 in ceiling'], rows: [
        ['King mattress', '76 × 80 in', 'Stands on its long edge (76 in tall), with 2 in to spare. It does not fit standing on its end.'],
        ['California king mattress', '72 × 84 in', 'Fits on its long edge (72 in tall).'],
        ['Queen mattress', '60 × 80 in', 'Fits on its long edge (60 in tall) with plenty of room.'],
        ['Tall bookcases and wardrobes', 'over 78 in', 'Travel lying down or taken apart.'],
        ['Fridges', 'most are under 6 ft', 'Usually travel upright, strapped to the wall.'],
      ], caption: 'Mattress sizes are standard North American sizes. Measure anything tall before moving day.' },
      { type: 'p', text: 'This matters most if you rent a truck yourself. A king mattress that has to lie flat takes a big slice of floor space, and a wardrobe that will not stand has to be emptied and taken apart. Measure the tallest pieces before you choose the truck.' },

      { type: 'h2', id: '26-ft', text: 'When you need a 26 ft truck' },
      { type: 'p', text: 'A 26 ft box truck typically holds around 1,600 to 1,700 cubic feet, roughly twice our 16 ft, with a taller box that takes tall furniture standing up. It is the truck for 3-bedroom homes, houses and larger townhouses, and the one we send with a crew of 3 for those moves.' },
      { type: 'list', items: [
        '**Choose the bigger truck when in doubt.** Unused space at the back costs nothing. Running out of space costs a second trip.',
        '**But tell us about tight streets.** A 26 ft truck needs much more room to park and turn than a 16 ft. Narrow lanes, steep driveways, cul-de-sacs and streets lined with parked cars at either address are worth mentioning when you book, so we can plan where the truck goes.',
      ] },

      { type: 'h2', id: 'one-trip', text: 'Why one bigger truck beats two trips' },
      { type: 'p', text: 'With hourly movers, the clock runs from arrival at your pickup until the last piece is in place, including the drive between homes. A second trip adds two more drives: back to the old home and over to the new one again. If the drive between homes is 25 minutes, a second trip adds about 50 minutes of driving, roughly $108 with 2 movers or $142 with 3, plus the time to load and unload that second half. A truck that is big enough the first time avoids all of it.' },
      { type: 'quote', text: 'Empty space at the back of the truck is free. Running out of space costs a second trip.' },

      { type: 'h2', id: 'vancouver-access', text: 'Truck access in Metro Vancouver' },
      { type: 'p', text: 'In a city of condo towers and narrow streets, where the truck can park often matters as much as how big it is.' },
      { type: 'checklist', items: [
        'Ask both buildings for the loading bay clearance height. Underground parkades are built for cars and are usually far too low for a moving truck.',
        'If there is no usable loading bay, plan for street parking right at the entrance. In the City of Vancouver, metered or restricted spaces can be reserved with a temporary street occupancy permit.',
        'Tell us about lanes, gates, low trees, overhead wires and steep driveways at either address.',
        'Move your own cars out of the driveway and the spot by the entrance the night before.',
      ] },
      { type: 'p', text: 'Every metre between the truck and your door is walked twice for every item, at both homes. See [how long it takes to move a house](/guides/how-long-does-it-take-to-move-a-house) for how much parking distance adds, and our [condo moving checklist](/guides/vancouver-condo-moving-checklist) for elevator bookings and street permits.' },
      { type: 'callout', tone: 'crew', title: 'How we choose the truck', text: 'When you book, we choose the truck from your home size and your list: the furniture, the boxes and the rooms people forget, like the storage locker and the garage. 2 movers come with our 16 ft truck. For homes bigger than a 2-bedroom apartment, we send 3 movers and the 26 ft. The more complete your list, the surer we are that everything goes in one trip.' },
    ],
    faqs: [
      { q: 'What size moving truck do I need for a 2-bedroom apartment?', a: 'Usually a 16 ft truck. Our 16 ft box is 16 × 7.5 × 6.5 ft inside, 780 cubic feet. A 2-bedroom with a full storage locker, a garage or a lot of large furniture can need more, so send a complete list.' },
      { q: 'What size truck do I need for a 3-bedroom house?', a: 'A 26 ft truck. It holds roughly twice as much as a 16 ft and lets the whole house go in one trip. We send it with a crew of 3 for any home bigger than a 2-bedroom apartment.' },
      { q: 'How many cubic feet is a 16 ft moving truck?', a: 'It depends on the truck. Ours holds 780 cubic feet (16 × 7.5 × 6.5 ft inside). Rental 16 ft trucks are listed at anywhere from about 658 to 800 cubic feet, so always ask for the inside dimensions.' },
      { q: 'Will a king mattress fit in a moving truck?', a: 'Yes. A king mattress is 76 × 80 inches. In our 16 ft truck, with 78 inches of inside height, it stands on its long edge with 2 inches to spare. It does not fit standing on its end.' },
      { q: 'Is it better to get a bigger truck or make two trips?', a: 'A bigger truck, almost always. With hourly movers a second trip puts two extra drives on the clock, plus the extra loading and unloading.' },
      { q: 'Can a moving truck park in my building\'s underground parking?', a: 'Usually not. Underground parkades are built for cars and are too low for a moving truck. Ask the building for the loading bay clearance, or plan for street parking at the entrance.' },
    ],
    sources: [
      { label: 'U-Haul: 26ft Moving Truck Rental (inside dimensions and volume)', href: 'https://www.uhaul.com/Trucks/26ft-Moving-Truck/FN' },
      { label: 'Penske Truck Rental: 16 Foot Box Truck', href: 'https://www.pensketruckrental.com/commercial-truck-rental/commercial-trucks/light-duty-trucks/16-foot-box-truck' },
      { label: 'U-Pack: Frequently Asked Questions about Budget Trucks', href: 'https://www.upack.com/articles/frequently-asked-questions-about-budget-trucks' },
      { label: 'City of Vancouver: Temporary street occupancy permits', href: 'https://vancouver.ca/streets-transportation/reserve-metered-spaces.aspx' },
    ],
    related: [
      { href: '/guides/2-vs-3-movers', label: '2 vs. 3 Movers', text: 'Which crew is cheaper for your move.' },
      { href: '/pricing/moving', label: 'Moving Rates', text: 'Both crews and trucks, and how the travel fee works.' },
      { href: '/residential-moving', label: 'Residential Moving', text: 'Houses and townhouses with our 26 ft truck.' },
    ],
  },
]

export const GUIDE_BY_SLUG = new Map(GUIDES.map(g => [g.slug, g]))
export const PUBLISHED_GUIDES = GUIDES.filter(g => !g.draft)

export function guidePath(g: Guide) {
  return `/guides/${g.slug}`
}

/** Rough reading time from all the text in the guide */
export function readingMinutes(g: Guide) {
  const text = [g.answer, ...g.body.flatMap(b => {
    switch (b.type) {
      case 'list': case 'checklist': return b.items
      case 'table': return b.rows.flat()
      case 'callout': return [b.title, b.text]
      case 'image': return [b.caption ?? '']
      default: return [b.text]
    }
  })].join(' ')
  return Math.max(2, Math.round(text.split(/\s+/).length / 220))
}

/**
 * Our own move log: one entry per completed move, filled in after the job.
 * Once there are enough house moves, it gives the typical times in "How long does it take to move a house in Vancouver?"
 * and becomes a real Metro Vancouver dataset other sites can cite.
 */
export interface MoveLogEntry {
  date: string
  city: string
  property: 'apartment' | 'condo' | 'townhouse' | 'house'
  bedrooms: number
  crew: 2 | 3
  truck: string
  /** Rough volume, e.g. 'half the 16\' truck' */
  volume: string
  access: string[]
  /** Hours at each stage, if timed */
  loadHours?: number
  driveHours?: number
  unloadHours?: number
  billedHours: number
}

export const MOVE_LOG: MoveLogEntry[] = []
