import type { Faq, SeoImage } from './site'

export type JunkCategoryId = 'furniture' | 'appliances' | 'electronics' | 'household' | 'cleanouts' | 'construction'

export interface JunkCategory {
  id: JunkCategoryId
  name: string
  blurb: string
  /** Used for any page in this category that has no photo of its own yet */
  fallback: [SeoImage, SeoImage]
}

export interface JunkItem {
  slug: string
  /** Page name, also used as link anchor text, e.g. "Couch Removal" */
  name: string
  category: JunkCategoryId
  h1: string
  /** <title> - kept under ~60 chars */
  title: string
  /** meta description - kept under ~160 chars */
  description: string
  keywords: string[]
  lead: string
  body: string[]
  /** "What we take" chips */
  takes: string[]
  /** Where it ends up - donation / recycling / disposal */
  disposal: string
  faqs: Faq[]
  /** Extra cross-links beyond the category siblings */
  related?: string[]
  /** null = text-only hero, no photo */
  image?: SeoImage | null
  /** null = page shows no second photo */
  image2?: SeoImage | null
  /** Optional extra photo, shown beside image2 */
  image3?: SeoImage
  /** Optional before/after pair from a real job */
  beforeAfter?: { before: SeoImage; after: SeoImage; caption: string }
}

export const JUNK_CATEGORIES: JunkCategory[] = [
  {
    id: 'furniture',
    name: 'Furniture',
    blurb: 'Couches, mattresses, dressers, tables and office furniture - carried out from any room, any floor.',
    fallback: [
      { src: '/junk-removal.jpg', alt: 'Old wooden chair waiting for furniture removal', pos: 'center 60%' },
      { src: '/truck-bed-loaded.jpg', alt: 'Stonegate truck loaded with furniture for removal' },
    ],
  },
  {
    id: 'appliances',
    name: 'Appliances',
    blurb: 'Fridges, freezers, washers, dryers, stoves, dishwashers, water heaters and A/C units - disconnected and recycled.',
    fallback: [
      { src: '/truck-bed-loaded.jpg', alt: 'Appliances loaded into the Stonegate junk removal truck' },
      { src: '/crew-loading-ramp.jpg', alt: 'Stonegate crew member using the truck ramp to load heavy items' },
    ],
  },
  {
    id: 'electronics',
    name: 'Electronics & E-Waste',
    blurb: 'TVs, computers, monitors, printers and cables - dropped at approved e-waste recyclers.',
    fallback: [
      { src: '/junk-before-warehouse.jpg', alt: 'Old computers, monitors and electronics waiting for e-waste removal' },
      { src: '/truck-bed-loaded.jpg', alt: 'Old electronics loaded into the Stonegate junk removal truck' },
    ],
  },
  {
    id: 'household',
    name: 'Household & Outdoor',
    blurb: 'Hot tubs, BBQs, carpets, gym equipment, playsets, yard waste and everyday household junk.',
    fallback: [
      { src: '/junk-removal.jpg', alt: 'Backyard junk waiting to be hauled away', pos: 'center 60%' },
      { src: '/junk-before-fence.jpg', alt: 'Pile of outdoor debris next to a fence before removal' },
    ],
  },
  {
    id: 'cleanouts',
    name: 'Cleanouts',
    blurb: 'Garages, basements, estates, storage units, apartments and offices - cleared out top to bottom.',
    fallback: [
      { src: '/burnaby/burnaby-junk-before-cleanout.jpg', alt: 'Cluttered space before a full cleanout' },
      { src: '/burnaby/burnaby-junk-after-cleanout.jpg', alt: 'Same space after the Stonegate cleanout' },
    ],
  },
  {
    id: 'construction',
    name: 'Renovation & Construction',
    blurb: 'Drywall, lumber, concrete, old decks, sheds, fences and scrap metal - heavy debris is what we do.',
    fallback: [
      { src: '/junk-before-siding.jpg', alt: 'Renovation debris and old lumber piled beside a house' },
      { src: '/junk-before-fence.jpg', alt: 'Torn-out fence boards and posts waiting for removal' },
    ],
  },
]

export const JUNK_ITEMS: JunkItem[] = [
  // ───────────────────────── Furniture ─────────────────────────
  {
    slug: 'furniture-removal',
    name: 'Furniture Removal',
    category: 'furniture',
    h1: 'Furniture Removal in Metro Vancouver',
    title: 'Furniture Removal & Disposal Vancouver',
    description: 'Old furniture removal and disposal across Metro Vancouver. Couches, beds, dressers, tables - we carry it out, donate what we can. Same-day pickup available.',
    keywords: ['furniture removal Vancouver', 'furniture disposal', 'old furniture pickup', 'furniture haul away', 'furniture donation pickup', 'used furniture removal'],
    lead: 'Couches, beds, dressers, tables and everything in between - our two-person crew lifts it, carries it out and hauls it away. You just point.',
    body: [
      'Getting rid of old furniture in Metro Vancouver is harder than it should be. Charities are picky about condition, the city bulky-item pickup has a waitlist, and nobody wants to rent a truck and wrestle a sectional down three flights of stairs. That is exactly the job we do every day.',
      'We remove single pieces or full rooms of furniture from houses, condos, apartments, offices and storage lockers. We dismantle bed frames and large wardrobes when needed, wrap pieces to protect your walls and door frames, and use dollies and straps so nothing gets dragged across your floors.',
      'Anything in usable condition goes to local donation partners first. Solid wood and metal frames are recycled, and only what is truly at the end of its life goes to the transfer station.',
    ],
    takes: ['Couches & sectionals', 'Sofa beds & recliners', 'Beds & bed frames', 'Mattresses & box springs', 'Dressers & wardrobes', 'Dining tables & chairs', 'Coffee & end tables', 'Bookcases & shelving', 'Desks & office chairs', 'Patio furniture', 'Cabinets & armoires', 'Entertainment units'],
    disposal: 'Good-condition furniture is dropped at local charities and reuse stores. Broken pieces are separated - wood, metal and upholstery each go to the right recycling stream - so as little as possible ends up in the landfill.',
    faqs: [
      { q: 'Do I need to bring the furniture outside?', a: 'No. We take furniture from wherever it sits - bedrooms, basements, upper floors or storage lockers. Our crew does all the lifting and carrying.' },
      { q: 'Will you take furniture that is broken or stained?', a: 'Yes. Unlike most donation pickups, we take furniture in any condition. Usable pieces get donated, and the rest is recycled or disposed of properly.' },
      { q: 'Can you take apart large furniture?', a: 'Yes. We dismantle bed frames, bunk beds, wall units and large wardrobes when they will not fit through a doorway in one piece.' },
    ],
    related: ['couch-removal', 'mattress-removal', 'dresser-removal', 'office-furniture-removal'],
    image: { src: '/junk/furniture-removal.jpg', alt: 'Old recliner, couch and dresser drawers left on the curb for furniture removal', pos: 'center 80%' },
    image2: { src: '/junk/furniture-removal-2.jpg', alt: 'Two worn orange recliners and garbage bags left outside, waiting for furniture removal', pos: 'center 45%' },
  },
  {
    slug: 'couch-removal',
    name: 'Couch Removal',
    category: 'furniture',
    h1: 'Couch & Sofa Removal in Metro Vancouver',
    title: 'Couch Removal & Sofa Disposal Vancouver',
    description: 'Couch and sofa removal in Vancouver, Burnaby and Metro Vancouver. Sectionals, sofa beds, loveseats and recliners hauled away - same-day available.',
    keywords: ['couch removal Vancouver', 'sofa removal', 'couch disposal', 'sectional removal', 'old couch pickup', 'sofa bed disposal', 'loveseat removal'],
    lead: 'From a single loveseat to a seven-piece sectional, we carry your old couch out of the house and haul it away - no heavy lifting, no rented truck.',
    body: [
      'A couch is usually the first piece of furniture people want gone and the last one they can move on their own. Sofas are heavy, awkward and rarely fit in a car. Sofa beds hide a steel mechanism that can add another 30 kg. We have moved thousands of them through tight condo hallways and narrow basement stairs.',
      'Our crew protects door frames and railings on the way out, takes off legs or separates sectional pieces when needed, and loads everything straight into our truck. There is nothing for you to prep - just tell us which couch is going.',
    ],
    takes: ['Sofas & couches', 'Sectionals', 'Sofa beds & pull-outs', 'Loveseats', 'Recliners & power recliners', 'Futons', 'Leather couches', 'Ottomans & chaise lounges', 'Outdoor sofas'],
    disposal: 'Couches in good shape go to local charity and reuse partners. Damaged sofas are broken down so the wood frame and metal springs can be recycled before the rest is disposed of.',
    faqs: [
      { q: 'How much does couch removal cost?', a: 'Junk removal is priced by load size, so a single couch is one of our most affordable jobs. Adding a few more items to the same pickup is often the best value. Send a photo for a free estimate.' },
      { q: 'Can you remove a sofa bed or recliner?', a: 'Yes. Sofa beds and power recliners are heavier than regular couches, but our two-person crew handles them routinely. We unplug power recliners and take them as-is.' },
      { q: 'Will you take a couch with pet damage or stains?', a: 'Yes, we take couches in any condition. If it cannot be donated, it is broken down and recycled or disposed of responsibly.' },
    ],
    related: ['furniture-removal', 'mattress-removal', 'patio-furniture-removal'],
    image: { src: '/junk/couch-removal.jpg', alt: 'Old tufted sofa and armchair left outside, waiting for couch removal', pos: 'center 75%' },
    image2: { src: '/junk/couch-removal-loading.jpg', alt: 'Stonegate crew member loading an old white leather couch into the junk removal truck', pos: 'center 45%' },
    image3: { src: '/burnaby/burnaby-move-apartment-boxes.jpg', alt: 'Stonegate crew member carrying a wrapped couch up the ramp into the truck', pos: 'center 40%' },
  },
  {
    slug: 'mattress-removal',
    name: 'Mattress Removal',
    category: 'furniture',
    h1: 'Mattress & Box Spring Removal in Metro Vancouver',
    title: 'Mattress Removal & Disposal Vancouver',
    description: 'Mattress and box spring removal across Metro Vancouver. Memory foam, futons, bed frames - picked up from any room and sent to mattress recycling.',
    keywords: ['mattress removal Vancouver', 'mattress disposal', 'mattress pickup', 'box spring removal', 'old mattress haul away', 'bed frame removal'],
    lead: 'Old mattresses, box springs and bed frames picked up from any room in your home and taken to a mattress recycler - not the curb.',
    body: [
      'Mattresses are one of the most common things we haul in Metro Vancouver, and one of the most annoying to deal with alone. They are floppy, heavy, do not fit in a car and most municipalities will not take them with the regular garbage.',
      'We take mattresses of every size and type - twin to king, memory foam, hybrid, pillow-top - along with box springs, bed frames and headboards. We can dismantle the frame for you while we are there. Bagging is not required, but if a mattress has a bed bug history, let us know and we will bring a mattress bag.',
    ],
    takes: ['Twin to king mattresses', 'Memory foam & hybrid', 'Pillow-top & gel mattresses', 'Box springs', 'Futon mattresses', 'Crib mattresses', 'Bed frames & headboards', 'Bunk beds', 'Air mattresses & toppers'],
    disposal: 'Mattresses and box springs go to a mattress recycler where the steel springs, foam, fibre and wood are separated and reused. Very little of a mattress needs to go to the landfill.',
    faqs: [
      { q: 'Do you recycle mattresses?', a: 'Yes. Mattresses and box springs are taken to a mattress recycling facility where the steel, foam and wood are separated for reuse.' },
      { q: 'Can you remove the bed frame too?', a: 'Yes. We take the full bed - mattress, box spring, frame and headboard - and can dismantle the frame on site.' },
      { q: 'Do I have to wrap or bag the mattress?', a: 'No. We handle the mattress as-is. The only exception is if there has been a bed bug issue - let us know and we will bag it before carrying it through your home.' },
    ],
    related: ['furniture-removal', 'couch-removal', 'dresser-removal'],
    image: { src: '/junk/mattress-removal.jpg', alt: 'Old mattress on a bed frame in a bedroom, ready for mattress removal', pos: 'center 60%' },
    image2: { src: '/junk/mattress-removal-job.jpg', alt: 'Stonegate crew member loading a wrapped mattress into the junk removal truck', pos: 'center 50%' },
  },
  {
    slug: 'dresser-removal',
    name: 'Dresser & Wardrobe Removal',
    category: 'furniture',
    h1: 'Dresser, Wardrobe & Cabinet Removal',
    title: 'Dresser & Wardrobe Removal Vancouver',
    description: 'Dresser, wardrobe, armoire and cabinet removal in Metro Vancouver. Heavy solid-wood pieces carried out and donated or recycled. Book online.',
    keywords: ['dresser removal', 'wardrobe removal Vancouver', 'armoire disposal', 'cabinet removal', 'old dresser pickup', 'chest of drawers disposal', 'bookcase removal'],
    lead: 'Heavy dressers, wardrobes, armoires, bookcases and cabinets carried out from bedrooms and basements and taken away for donation or recycling.',
    body: [
      'Solid-wood dressers and wardrobes are some of the heaviest furniture in a home, and they are always upstairs. Particle-board pieces are the opposite problem - they tend to fall apart the moment you try to move them. Either way, we take care of it.',
      'We empty-check drawers with you, remove mirrors and doors to make pieces lighter and safer to carry, and dismantle flat-pack wardrobes if they will not fit through the door.',
    ],
    takes: ['Dressers & chests of drawers', 'Wardrobes & armoires', 'Nightstands', 'Bookcases & shelving units', 'China cabinets & hutches', 'Filing cabinets', 'TV stands & entertainment units', 'Vanities & mirrors'],
    disposal: 'Solid-wood dressers and cabinets are excellent donation candidates and usually go straight to local charities. Damaged particle-board furniture is broken down for wood waste processing.',
    faqs: [
      { q: 'Do I need to empty the drawers first?', a: 'Ideally yes, but if a few things are left behind we will check with you before anything goes on the truck.' },
      { q: 'Can you take a dresser down narrow stairs?', a: 'Yes. We remove mirrors, doors and drawers to make heavy pieces lighter and easier to carry safely down stairs.' },
    ],
    related: ['furniture-removal', 'table-removal', 'mattress-removal'],
    image: { src: '/junk/dresser-removal.jpg', alt: 'Old solid-wood chest of drawers on a porch, ready for dresser removal', pos: 'center 75%' },
    image2: null,
  },
  {
    slug: 'table-removal',
    name: 'Table & Chair Removal',
    category: 'furniture',
    h1: 'Table & Chair Removal in Metro Vancouver',
    title: 'Dining Table & Chair Removal Vancouver',
    description: 'Dining tables, coffee tables, desks and chairs removed and hauled away across Metro Vancouver. Donation-first disposal. Free quote.',
    keywords: ['table removal', 'dining table disposal', 'coffee table removal', 'chair removal Vancouver', 'desk removal', 'old table pickup'],
    lead: 'Dining sets, coffee tables, side tables, desks and chairs - taken apart if needed and hauled out in one trip.',
    body: [
      'Dining tables look simple until you try to get one through a doorway. Glass tops, extension leaves and pedestal bases make them awkward to move, and a full set with six chairs fills a car several times over.',
      'Our crew removes legs and leaves where possible, wraps glass tops so they travel safely, and stacks chairs to keep your load small - which keeps your price down too.',
    ],
    takes: ['Dining tables & sets', 'Coffee tables', 'End & side tables', 'Glass-top tables', 'Kitchen chairs & stools', 'Desks & computer desks', 'Folding tables', 'Kids tables & chairs'],
    disposal: 'Tables and chairs in reasonable shape are donated. Glass tops are recycled separately, and broken wood or metal furniture goes to the appropriate recycling stream.',
    faqs: [
      { q: 'Can you take just a few chairs?', a: 'Yes. Small loads cost less. Add any other items you want gone to get more value from the same visit.' },
      { q: 'Do you take glass table tops?', a: 'Yes. We wrap glass tops to carry them safely and recycle them separately from the frame.' },
    ],
    related: ['furniture-removal', 'office-furniture-removal', 'patio-furniture-removal'],
    image: { src: '/junk/table-removal.jpg', alt: 'Worn white wooden table with peeling paint and bentwood chairs, ready for table and chair removal' },
    image2: null,
  },
  {
    slug: 'office-furniture-removal',
    name: 'Office Furniture Removal',
    category: 'furniture',
    h1: 'Office Furniture Removal & Disposal',
    title: 'Office Furniture Removal Vancouver',
    description: 'Office furniture removal in Vancouver and Metro Vancouver. Desks, chairs, cubicles, filing cabinets and boardroom tables. After-hours pickup available.',
    keywords: ['office furniture removal Vancouver', 'office furniture disposal', 'cubicle removal', 'desk disposal', 'office chair removal', 'filing cabinet disposal', 'commercial furniture removal'],
    lead: 'Desks, office chairs, cubicles, filing cabinets and boardroom tables removed quickly and quietly - including evenings and weekends so your team keeps working.',
    body: [
      'Whether you are downsizing, relocating or refreshing your workspace, old office furniture has to go somewhere. We work with offices, clinics, retail stores and property managers across Metro Vancouver to clear furniture without disrupting the workday.',
      'We dismantle cubicles and L-shaped desks, use freight elevators and loading docks where buildings require them, and can book a pickup outside business hours.',
    ],
    takes: ['Office desks & L-desks', 'Office chairs', 'Cubicles & partitions', 'Filing cabinets', 'Boardroom tables', 'Reception furniture', 'Shelving & storage racks', 'Whiteboards', 'Break-room furniture'],
    disposal: 'Office furniture in usable condition is passed on to reuse organizations. Metal filing cabinets and desk frames are recycled as scrap metal, and the remainder is disposed of properly.',
    faqs: [
      { q: 'Can you work after business hours?', a: 'Yes. We can schedule evening or weekend pickups so furniture removal does not disrupt your staff or customers.' },
      { q: 'Do you handle building move-out requirements?', a: 'Yes. We work with your building management on elevator bookings, loading-dock times and certificates of insurance when required.' },
    ],
    related: ['office-cleanout', 'commercial-junk-removal', 'electronics-removal'],
    image: { src: '/junk/office-furniture-removal.jpg', alt: 'Row of office chairs and a long desk ready for office furniture removal', pos: '60% center' },
    image2: null,
  },
  {
    slug: 'patio-furniture-removal',
    name: 'Patio Furniture Removal',
    category: 'furniture',
    h1: 'Patio & Outdoor Furniture Removal',
    title: 'Patio Furniture Removal Vancouver',
    description: 'Patio and outdoor furniture removal across Metro Vancouver. Tables, chairs, loungers, umbrellas and gazebos hauled from your yard or balcony.',
    keywords: ['patio furniture removal', 'outdoor furniture disposal', 'balcony furniture removal', 'garden furniture removal Vancouver', 'gazebo removal', 'patio set disposal'],
    lead: 'Weathered patio sets, loungers, umbrellas and gazebos cleared from your yard, deck or condo balcony.',
    body: [
      'Coastal weather is hard on outdoor furniture. After a few Vancouver winters, wicker unravels, cushions mould and metal frames rust. We clear it all out so your outdoor space is ready for the next season.',
      'We regularly remove patio furniture from condo balconies - carrying it through the unit and down the elevator with care - as well as from backyards, decks and rooftop patios.',
    ],
    takes: ['Patio tables & chairs', 'Loungers & daybeds', 'Outdoor sectionals', 'Umbrellas & bases', 'Gazebos & canopies', 'Planters', 'Outdoor cushions', 'Benches & swings'],
    disposal: 'Metal and plastic patio furniture is recycled; teak and solid wood pieces in good shape are donated. Mouldy cushions are disposed of separately.',
    faqs: [
      { q: 'Can you take furniture off a condo balcony?', a: 'Yes. We carry it through your unit with floor protection and down the elevator, booked according to your building rules.' },
      { q: 'Do you take umbrella bases filled with concrete or water?', a: 'Yes. Concrete bases are heavy but no problem. Water-filled bases are drained before loading.' },
    ],
    related: ['furniture-removal', 'bbq-removal', 'hot-tub-removal'],
    image: { src: '/junk/patio-furniture-removal.jpg', alt: 'Rain-soaked metal patio chairs and side tables covered in fallen leaves, ready for patio furniture removal' },
    image2: null,
  },

  // ───────────────────────── Appliances ─────────────────────────
  {
    slug: 'appliance-removal',
    name: 'Appliance Removal',
    category: 'appliances',
    h1: 'Appliance Removal & Disposal in Metro Vancouver',
    title: 'Appliance Removal & Disposal Vancouver',
    description: 'Appliance removal and recycling in Metro Vancouver. Fridges, washers, dryers, stoves, dishwashers and water heaters - disconnected, hauled and recycled.',
    keywords: ['appliance removal Vancouver', 'appliance disposal', 'appliance haul away', 'old appliance pickup', 'large appliance pickup', 'major appliance disposal Metro Vancouver'],
    lead: 'Fridges, freezers, washers, dryers, stoves, dishwashers and more - we disconnect them, carry them out and take them to an appliance recycler.',
    body: [
      'Major appliances are heavy, bulky and full of materials that should not go to the landfill - steel, copper, refrigerant and electronics. In BC, most of them can and should be recycled. We make that the easy option.',
      'Our crew unplugs and disconnects standard appliances, uses a dolly with straps for stairs, and protects floors on the way out. Replacing an appliance? We can pick up the old one the same day the new one arrives.',
    ],
    takes: ['Refrigerators & freezers', 'Washing machines', 'Clothes dryers', 'Stoves & ovens', 'Dishwashers', 'Microwaves', 'Water heaters', 'Air conditioners', 'Space heaters & dehumidifiers', 'Small kitchen appliances'],
    disposal: 'Appliances go to approved appliance recyclers. Refrigerant is recovered from fridges, freezers and A/C units by certified technicians, and the metal is shredded and reused.',
    faqs: [
      { q: 'Do you disconnect appliances?', a: 'We unplug and disconnect standard electric appliances and washer hoses. Gas lines and hard-wired units must be shut off and disconnected by a licensed technician before we arrive.' },
      { q: 'Are appliances recycled?', a: 'Yes. Appliances are taken to approved recyclers, where refrigerant is safely recovered and the steel, copper and plastic are reused.' },
      { q: 'Can you take an appliance down stairs?', a: 'Yes. We use appliance dollies with straps and two crew members for every stairway.' },
    ],
    related: ['refrigerator-removal', 'washer-dryer-removal', 'stove-removal', 'electronics-removal'],
    image: { src: '/junk/appliance-removal.jpg', alt: 'Old stoves, ovens and a rusted water tank waiting for appliance removal', pos: 'center 45%' },
    image2: { src: '/crew-loading-ramp.jpg', alt: 'Stonegate crew member sliding out the truck ramp to load heavy appliances' },
    image3: { src: '/team-with-truck.jpg', alt: 'Stonegate Moving Solutions crew standing in front of the junk removal truck', pos: '45% center' },
  },
  {
    slug: 'refrigerator-removal',
    name: 'Refrigerator Removal',
    category: 'appliances',
    h1: 'Refrigerator & Freezer Removal',
    title: 'Fridge & Freezer Removal Vancouver',
    description: 'Fridge and freezer removal in Metro Vancouver. French door, side-by-side, chest freezers and mini fridges hauled away and recycled. Same-day available.',
    keywords: ['fridge removal Vancouver', 'refrigerator disposal', 'freezer removal', 'old fridge pickup', 'chest freezer disposal', 'mini fridge removal', 'fridge haul away'],
    lead: 'Old fridges and freezers of every size - French door, side-by-side, top freezer, chest freezer or bar fridge - carried out and sent for proper recycling.',
    body: [
      'A full-size refrigerator can weigh well over 100 kg and contains refrigerant that must be recovered before the unit is scrapped. That is why most people should not haul a fridge themselves - and why we always take them to an approved appliance recycler.',
      'We remove fridges from kitchens, garages and basements, take off doors when a doorway is too tight, and use a strapped appliance dolly on stairs. Please empty and defrost the unit beforehand when possible.',
    ],
    takes: ['French door refrigerators', 'Side-by-side fridges', 'Top & bottom freezer fridges', 'Compact & mini fridges', 'Chest freezers', 'Upright freezers', 'Wine & beverage coolers', 'Commercial fridges'],
    disposal: 'Every fridge and freezer goes to an approved recycler where certified technicians recover the refrigerant and oil before the steel, copper and plastic are recycled.',
    faqs: [
      { q: 'Do I need to empty the fridge first?', a: 'Yes, please remove all food. If the freezer is iced over, unplug it the night before so it can defrost - it makes the unit lighter and keeps your floors dry.' },
      { q: 'Can you take a fridge with a water line?', a: 'Yes. Shut off the water valve behind the fridge and we will disconnect the line and cap it before removal.' },
    ],
    related: ['appliance-removal', 'stove-removal', 'dishwasher-removal'],
    image: { src: '/junk/refrigerator-removal.jpg', alt: 'Old white top-freezer refrigerator ready for fridge removal', pos: 'center 40%' },
    image2: null,
  },
  {
    slug: 'washer-dryer-removal',
    name: 'Washer & Dryer Removal',
    category: 'appliances',
    h1: 'Washer & Dryer Removal',
    title: 'Washer & Dryer Removal Vancouver',
    description: 'Washing machine and dryer removal in Metro Vancouver. Top-load, front-load and stacked units disconnected and recycled. Book online or call.',
    keywords: ['washer removal Vancouver', 'dryer disposal', 'washing machine removal', 'old washer pickup', 'stacked washer dryer removal', 'dryer haul away'],
    lead: 'Top-load, front-load and stacked washer-dryer units disconnected, drained and hauled away for recycling.',
    body: [
      'Washers and dryers tend to live in the hardest places to get to - basements, tight laundry closets and condo stacking nooks. Front-load washers are also deceptively heavy thanks to the concrete counterweight inside.',
      'We shut off and disconnect the water hoses, drain the washer, disconnect dryer vents and carry the units out with an appliance dolly. Stacked units are separated safely before removal.',
    ],
    takes: ['Top-load washers', 'Front-load washers', 'Electric dryers', 'Stacked washer-dryer units', 'All-in-one combo units', 'Laundry pedestals', 'Utility sinks'],
    disposal: 'Washers and dryers are taken to appliance recyclers, where the steel drum, motor and wiring are recovered for reuse.',
    faqs: [
      { q: 'Can you disconnect a gas dryer?', a: 'Gas dryers must be shut off and disconnected by a licensed gas fitter before we arrive. Electric dryers we can unplug and remove ourselves.' },
      { q: 'Do you remove stacked units from condos?', a: 'Yes. We separate stacked units, protect the hallway and use the elevator per your building rules.' },
    ],
    related: ['appliance-removal', 'refrigerator-removal', 'water-heater-removal'],
    image: { src: '/junk/washer-dryer-removal.jpg', alt: 'Front-load washing machines ready for washer and dryer removal', pos: '72% center' },
    image2: null,
  },
  {
    slug: 'stove-removal',
    name: 'Stove & Oven Removal',
    category: 'appliances',
    h1: 'Stove, Oven & Range Removal',
    title: 'Stove & Oven Removal Vancouver',
    description: 'Stove, oven, range and cooktop removal in Metro Vancouver. Old kitchen appliances hauled away and recycled during renos or replacements.',
    keywords: ['stove removal Vancouver', 'oven disposal', 'range removal', 'old stove pickup', 'cooktop removal', 'kitchen appliance removal', 'wall oven removal'],
    lead: 'Freestanding ranges, wall ovens, cooktops and range hoods removed during kitchen renovations or appliance upgrades.',
    body: [
      'Upgrading your kitchen or doing a full renovation? Old stoves and ovens are heavy, sharp-edged and awkward. We pull them out, carry them through your home without scratching floors and take them for metal recycling.',
      'If you are mid-renovation, we can take the old appliances together with cabinets, countertops and other kitchen debris in the same trip.',
    ],
    takes: ['Electric ranges', 'Gas ranges (disconnected)', 'Wall ovens', 'Cooktops', 'Range hoods', 'Microwaves & over-the-range units', 'Toaster ovens'],
    disposal: 'Stoves and ovens are almost entirely steel, so they go straight to metal recyclers.',
    faqs: [
      { q: 'Can you remove a gas stove?', a: 'Yes, once a licensed gas fitter has shut off and capped the line. We then remove and haul the stove.' },
      { q: 'Can you take old kitchen cabinets too?', a: 'Yes. Combine your appliances with cabinets, counters and other renovation debris in the same visit and save.' },
    ],
    related: ['appliance-removal', 'dishwasher-removal', 'construction-debris-removal'],
    image: { src: '/junk/stove-removal.jpg', alt: 'Rusted old gas stove and oven waiting for stove removal', pos: 'center 35%' },
    image2: { src: '/junk/stonegate-truck-crew.jpg', alt: 'Stonegate crew working on the junk removal truck', pos: 'center 60%' },
    image3: { src: '/hero-truck.jpg', alt: 'Stonegate truck parked outside a home for an appliance pickup', pos: '70% center' },
  },
  {
    slug: 'dishwasher-removal',
    name: 'Dishwasher Removal',
    category: 'appliances',
    h1: 'Dishwasher Removal & Disposal',
    title: 'Dishwasher Removal & Disposal Vancouver',
    description: 'Dishwasher removal and recycling in Metro Vancouver. Built-in and portable dishwashers disconnected and hauled away. Same-day available.',
    keywords: ['dishwasher removal', 'dishwasher disposal Vancouver', 'old dishwasher pickup', 'built-in dishwasher removal', 'dishwasher haul away'],
    lead: 'Built-in or portable, we pull out your old dishwasher and take it for recycling - often alongside other kitchen junk.',
    body: [
      'A dishwasher is not heavy, but it is wet, awkward and usually wedged between cabinets. Once it is disconnected from water, drain and power, we slide it out, cap the lines and haul it away.',
      'Most customers combine a dishwasher with other items - an old fridge, microwave or bags of renovation debris - to make the most of a single pickup.',
    ],
    takes: ['Built-in dishwashers', 'Portable dishwashers', 'Drawer dishwashers', 'Countertop dishwashers', 'Garbage disposals'],
    disposal: 'Dishwashers go to appliance recyclers where the stainless steel tub, pump and wiring are recovered.',
    faqs: [
      { q: 'Do you disconnect the dishwasher?', a: 'If the water is shut off, we disconnect the supply and drain lines and unplug the unit. Hard-wired units should be disconnected by an electrician first.' },
    ],
    related: ['appliance-removal', 'stove-removal', 'refrigerator-removal'],
    image: { src: '/junk/dishwasher-removal.jpg', alt: 'Old built-in dishwasher in a dated kitchen, ready for dishwasher removal', pos: 'center 58%' },
    image2: null,
  },
  {
    slug: 'water-heater-removal',
    name: 'Water Heater Removal',
    category: 'appliances',
    h1: 'Hot Water Tank & Water Heater Removal',
    title: 'Water Heater & Hot Water Tank Removal',
    description: 'Hot water tank and water heater removal in Metro Vancouver. Drained, carried up from the basement and recycled as scrap metal.',
    keywords: ['hot water tank removal', 'water heater disposal Vancouver', 'old hot water tank pickup', 'hot water tank haul away', 'tankless water heater removal'],
    lead: 'Old hot water tanks hauled out of basements, crawl spaces and utility rooms - drained, carried up and recycled.',
    body: [
      'Your plumber installed the new tank but left the old one in the garage? That is one of the most common calls we get. Water heaters are tall, heavy and slippery, and they are usually in the basement.',
      'Make sure the tank is fully drained, and we will carry it out with a strapped dolly and take it to a metal recycler.',
    ],
    takes: ['Electric hot water tanks', 'Gas water heaters (disconnected)', 'Tankless units', 'Expansion tanks', 'Boilers', 'Water softeners'],
    disposal: 'Water heaters are steel tanks with copper fittings, so they are recycled as scrap metal.',
    faqs: [
      { q: 'Does the tank need to be drained?', a: 'Yes - a full 40-gallon tank holds about 150 kg of water. Please drain it beforehand or ask your plumber to.' },
      { q: 'Can you remove a gas water heater?', a: 'Yes, once a licensed gas fitter has disconnected and capped the gas line.' },
    ],
    related: ['appliance-removal', 'scrap-metal-removal', 'washer-dryer-removal'],
    image: { src: '/junk/water-heater-removal.jpg', alt: 'Wall-mounted electric water heater ready to be disconnected and removed', pos: 'center 8%' },
    image2: null,
  },
  {
    slug: 'air-conditioner-removal',
    name: 'Air Conditioner Removal',
    category: 'appliances',
    h1: 'Air Conditioner & Heater Removal',
    title: 'Air Conditioner Removal & Disposal',
    description: 'Air conditioner removal and recycling in Metro Vancouver. Window units, portable A/Cs, dehumidifiers and space heaters - refrigerant handled properly.',
    keywords: ['air conditioner removal', 'AC disposal Vancouver', 'portable AC removal', 'window AC disposal', 'dehumidifier disposal', 'space heater removal'],
    lead: 'Window units, portable A/Cs, dehumidifiers and space heaters picked up and sent to recyclers who recover the refrigerant.',
    body: [
      'More Metro Vancouver homes added air conditioning after recent heat waves - which means more old and broken units waiting to be replaced. A/C units and dehumidifiers contain refrigerant and cannot simply go in the garbage.',
      'We remove window units from frames, collect portable units from any floor, and take them to approved recyclers.',
    ],
    takes: ['Window A/C units', 'Portable air conditioners', 'Dehumidifiers', 'Space heaters', 'Fans & air purifiers', 'Baseboard heaters'],
    disposal: 'Refrigerant-containing units go to approved appliance recyclers so the refrigerant can be safely recovered before the metal is recycled.',
    faqs: [
      { q: 'Do you remove central A/C or heat pumps?', a: 'We remove disconnected units. Central systems and heat pumps need to be decommissioned by an HVAC technician first, then we haul them away.' },
    ],
    related: ['appliance-removal', 'electronics-removal', 'refrigerator-removal'],
    image: { src: '/junk/air-conditioner-removal.jpg', alt: 'Wall-mounted air conditioner unit ready for air conditioner removal', pos: 'center 88%' },
    image2: null,
  },

  // ───────────────────────── Electronics ─────────────────────────
  {
    slug: 'electronics-removal',
    name: 'Electronics & E-Waste Removal',
    category: 'electronics',
    h1: 'Electronics & E-Waste Removal',
    title: 'Electronics & E-Waste Removal Vancouver',
    description: 'Electronics and e-waste removal in Metro Vancouver. We pick up old computers, monitors, printers, servers and cables from your home or office.',
    keywords: ['e-waste removal Vancouver', 'electronics removal', 'computer disposal', 'e-waste pickup', 'old computer pickup', 'monitor disposal', 'printer disposal', 'electronic waste removal Metro Vancouver'],
    lead: 'Computers, monitors, printers, servers, phones and tangled boxes of cables - we come to your home or office, carry it all out and haul it away.',
    body: [
      'Old electronics pile up in closets, basements and back offices because nobody wants to load them into a car and find out where they go. You do not have to: we come to you, do all the carrying, and take care of the drop-off ourselves.',
      'We handle single-item pickups and full office IT cleanouts. If you need hard drives wiped or destroyed, we recommend doing that before pickup - we are happy to wait while you pull drives.',
    ],
    takes: ['Desktop computers & laptops', 'Monitors', 'Printers & copiers', 'Servers & networking gear', 'Phones & tablets', 'Keyboards, mice & cables', 'Audio equipment & speakers', 'Game consoles', 'Small electronics'],
    disposal: 'All electronics go to approved e-waste recycling depots, where they are dismantled and the metals, glass and plastics recovered.',
    faqs: [
      { q: 'Do you destroy hard drives?', a: 'We do not offer certified data destruction. Please remove or wipe drives before pickup - we can wait while you pull them.' },
      { q: 'Can you clear out an office full of old IT equipment?', a: 'Yes. We regularly handle office e-waste cleanouts, including after-hours pickups.' },
    ],
    related: ['tv-removal', 'office-cleanout', 'appliance-removal'],
    image: { src: '/junk/electronics-removal.jpg', alt: 'Pile of old monitors, printers, computers and cables collected during e-waste removal' },
    image2: null,
  },
  {
    slug: 'tv-removal',
    name: 'TV Removal',
    category: 'electronics',
    h1: 'TV Removal & Television Disposal',
    title: 'TV Removal & Disposal Vancouver',
    description: 'TV removal and disposal in Metro Vancouver. Flat screens, plasma, LCD, old CRT and rear-projection TVs picked up and recycled.',
    keywords: ['TV removal Vancouver', 'TV disposal', 'television removal', 'old TV pickup', 'flat screen disposal', 'CRT TV removal', 'projection TV disposal'],
    lead: 'Flat screens, plasma TVs, heavy old tube TVs and rear-projection sets - we take them all, plus the stand, mount and cables.',
    body: [
      'Old televisions are a classic garage and basement item. CRT tube TVs and rear-projection sets are extremely heavy and contain leaded glass, and even newer flat screens count as e-waste in BC.',
      'We remove TVs from walls and stands, carry them out safely and drop them at an approved electronics recycler.',
    ],
    takes: ['LED & LCD TVs', 'Plasma TVs', 'Smart TVs', 'CRT tube TVs', 'Rear-projection TVs', 'Projectors', 'DVD & Blu-ray players', 'TV stands & wall mounts', 'Antennas & cables'],
    disposal: 'All TVs go to approved e-waste recyclers, where the glass, circuit boards and metals are recovered.',
    faqs: [
      { q: 'Can you take down a wall-mounted TV?', a: 'Yes. We take the TV off the mount and can remove the mount as well. Patching the wall is not included.' },
      { q: 'Do you take old tube TVs?', a: 'Yes. Heavy CRT and rear-projection TVs are no problem for our two-person crew.' },
    ],
    related: ['electronics-removal', 'furniture-removal', 'basement-cleanout'],
    image: { src: '/junk/tv-removal.jpg', alt: 'Stack of old CRT tube televisions waiting for TV removal and disposal', pos: 'center 35%' },
    image2: null,
  },

  // ───────────────────────── Household & Outdoor ─────────────────────────
  {
    slug: 'hot-tub-removal',
    name: 'Hot Tub Removal',
    category: 'household',
    h1: 'Hot Tub & Spa Removal in Metro Vancouver',
    title: 'Hot Tub Removal & Disposal Vancouver',
    description: 'Hot tub and spa removal across Metro Vancouver. We cut up, carry out and dispose of old hot tubs and covers. Free in-person estimate.',
    keywords: ['hot tub removal Vancouver', 'hot tub disposal', 'spa removal', 'jacuzzi removal', 'old hot tub haul away', 'hot tub demolition', 'hot tub cover disposal'],
    lead: 'Old hot tubs, spas and covers removed from backyards and decks - cut down on site when needed and hauled away in one visit.',
    body: [
      'A hot tub can weigh 300-450 kg empty and rarely fits back through the gate it came in. Removing one usually means cutting it into manageable sections, carrying it out piece by piece and disposing of fibreglass, wood and metal separately.',
      'Have an electrician disconnect the power and drain the tub before we arrive. We take care of the rest, including the cover, steps and any surrounding deck boards you want gone.',
    ],
    takes: ['Acrylic & fibreglass hot tubs', 'Inflatable hot tubs', 'Swim spas', 'Hot tub covers', 'Hot tub steps & surrounds', 'Saunas', 'Above-ground pools'],
    disposal: 'Hot tubs are dismantled so the metal frame, pumps and wiring can be recycled. Fibreglass shells and foam go to proper disposal.',
    faqs: [
      { q: 'Does the hot tub need to be drained?', a: 'Yes. Please drain it fully and have the power disconnected by an electrician before we arrive.' },
      { q: 'How do you get a hot tub out of a fenced yard?', a: 'If it will not fit through the gate, we cut it into sections on site and carry them out. You just need to give us access.' },
      { q: 'How much does hot tub removal cost?', a: 'It depends on the size, weight and access. Send us photos for a free estimate - we confirm the exact price in person before starting.' },
    ],
    related: ['deck-removal', 'shed-removal', 'playset-removal'],
    image: { src: '/junk/hot-tub-removal.jpg', alt: 'Old wood-sided hot tub with worn cover in a backyard, ready for hot tub removal', pos: 'center 68%' },
    image2: null,
  },
  {
    slug: 'bbq-removal',
    name: 'BBQ & Grill Removal',
    category: 'household',
    h1: 'BBQ & Grill Removal',
    title: 'BBQ & Grill Removal Vancouver',
    description: 'BBQ and grill removal in Metro Vancouver. Gas, charcoal and pellet grills hauled away and recycled. Empty propane tanks accepted.',
    keywords: ['BBQ removal Vancouver', 'grill disposal', 'barbecue removal', 'old BBQ pickup', 'gas grill disposal', 'propane tank disposal'],
    lead: 'Rusty gas BBQs, charcoal grills, smokers and pellet grills hauled off your patio or balcony and recycled.',
    body: [
      'Most BBQs are mostly steel, which makes them easy to recycle - once you get them off the patio. We roll or carry them out, including from condo balconies, and take them for metal recycling.',
      'Detach the propane tank before we arrive. We can take empty tanks to an approved exchange or recycling point.',
    ],
    takes: ['Gas BBQs', 'Charcoal grills', 'Pellet grills & smokers', 'Outdoor kitchens & carts', 'Fire pits', 'Patio heaters', 'Empty propane tanks'],
    disposal: 'BBQs and grills are recycled as scrap metal. Propane tanks are taken to designated exchange or recycling depots.',
    faqs: [
      { q: 'Do you take propane tanks?', a: 'We take empty propane tanks and bring them to a designated depot. Please disconnect them from the BBQ before we arrive.' },
    ],
    related: ['patio-furniture-removal', 'scrap-metal-removal', 'yard-waste-removal'],
    image: { src: '/junk/bbq-removal.jpg', alt: 'Old weathered BBQ grill with peeling paint, ready for BBQ removal' },
    image2: null,
  },
  {
    slug: 'carpet-removal',
    name: 'Carpet & Rug Removal',
    category: 'household',
    h1: 'Carpet, Rug & Flooring Removal',
    title: 'Carpet Removal & Disposal Vancouver',
    description: 'Carpet, rug, underlay and flooring removal in Metro Vancouver. Old carpet hauled away during renos and move-outs. Free quote.',
    keywords: ['carpet removal Vancouver', 'carpet disposal', 'rug removal', 'old carpet pickup', 'underlay disposal', 'flooring removal', 'laminate disposal'],
    lead: 'Rolled carpets, area rugs, underlay and torn-out flooring hauled away - whether you pulled it up yourself or need us to.',
    body: [
      'Carpet is heavier than it looks, especially wool carpet or anything that has been wet. A single room of carpet and underlay can fill a car, and most transfer stations charge extra for it.',
      'If the carpet is already up, we carry out the rolls. If it is still down, we can cut and pull standard wall-to-wall carpet and underlay as part of the job - just mention it when you book.',
    ],
    takes: ['Wall-to-wall carpet', 'Carpet underlay', 'Area rugs', 'Wool carpets', 'Laminate & vinyl flooring', 'Hardwood offcuts', 'Carpet tiles', 'Stair runners'],
    disposal: 'Rugs in good shape are donated. Carpet and underlay are disposed of at approved facilities, and clean wood flooring is processed as wood waste.',
    faqs: [
      { q: 'Can you pull up the carpet for us?', a: 'Yes. We can cut and pull standard wall-to-wall carpet and underlay. Removing tack strips and staples is quoted separately.' },
    ],
    related: ['construction-debris-removal', 'move-out-cleanout', 'basement-cleanout'],
    image: { src: '/junk/carpet-removal.jpg', alt: 'Stacks of old rugs and rolled carpets piled up for carpet and rug removal', pos: 'center 62%' },
    image2: null,
  },
  {
    slug: 'christmas-tree-removal',
    name: 'Christmas Tree Removal',
    category: 'household',
    h1: 'Christmas Tree Removal & Pickup',
    title: 'Christmas Tree Removal & Pickup Vancouver',
    description: 'Christmas tree pickup and removal across Metro Vancouver. Real trees composted, artificial trees and holiday decorations hauled away.',
    keywords: ['Christmas tree removal Vancouver', 'Christmas tree pickup', 'tree disposal', 'artificial tree disposal', 'holiday decoration removal'],
    lead: 'Real or artificial, we carry your tree out without trailing needles through the house and take it away after the holidays.',
    body: [
      'Getting a dried-out tree through your home and into a car is a mess. We wrap it, carry it out and take it to a yard-waste facility to be chipped and composted.',
      'Clearing out old artificial trees, lights and broken decorations? Add them to the same pickup.',
    ],
    takes: ['Real Christmas trees', 'Artificial trees', 'Tree stands', 'Lights & decorations', 'Wreaths & garland', 'Holiday inflatables'],
    disposal: 'Real trees are taken to yard-waste facilities for composting. Artificial trees are donated when possible; broken ones are disposed of properly.',
    faqs: [
      { q: 'Do you remove the tree from inside the house?', a: 'Yes. We wrap it to keep the needles contained and carry it out for you.' },
    ],
    related: ['yard-waste-removal', 'household-junk-removal', 'garage-cleanout'],
    image: { src: '/junk/christmas-tree-removal.jpg', alt: 'Decorated artificial Christmas tree left outside, waiting for Christmas tree removal', pos: 'center 50%' },
    image2: null,
  },
  {
    slug: 'exercise-equipment-removal',
    name: 'Exercise Equipment Removal',
    category: 'household',
    h1: 'Exercise Equipment & Home Gym Removal',
    title: 'Treadmill & Gym Equipment Removal',
    description: 'Treadmill, elliptical and home gym equipment removal in Metro Vancouver. Heavy weights, benches and machines carried out and recycled.',
    keywords: ['treadmill removal Vancouver', 'exercise equipment disposal', 'gym equipment removal', 'elliptical disposal', 'weight bench removal', 'home gym removal'],
    lead: 'Treadmills, ellipticals, weight machines, benches and plates - dismantled when needed and carried out of basements and spare rooms.',
    body: [
      'Treadmills are among the heaviest household items we remove, and they always seem to be in the basement. Home gym machines with cable stacks can weigh several hundred kilograms.',
      'We dismantle machines into safe-to-carry pieces, protect stairs and floors, and take the steel to recycling.',
    ],
    takes: ['Treadmills', 'Ellipticals', 'Exercise bikes & Pelotons', 'Rowing machines', 'Home gym machines', 'Weight benches & racks', 'Dumbbells & plates', 'Gym flooring mats'],
    disposal: 'Working equipment is donated where possible. Everything else is dismantled and recycled as scrap metal and electronics.',
    faqs: [
      { q: 'Can you take a treadmill up from the basement?', a: 'Yes. We fold or dismantle it if needed and use two crew members on the stairs.' },
    ],
    related: ['basement-cleanout', 'scrap-metal-removal', 'furniture-removal'],
    image: null,
    image2: null,
  },
  {
    slug: 'lawn-mower-removal',
    name: 'Lawn Mower Removal',
    category: 'household',
    h1: 'Lawn Mower & Yard Equipment Removal',
    title: 'Lawn Mower & Yard Equipment Disposal',
    description: 'Lawn mower and yard equipment removal in Metro Vancouver. Running or broken mowers, trimmers, snow blowers and tools hauled away and recycled.',
    keywords: ['lawn mower disposal Vancouver', 'lawn mower removal', 'yard equipment disposal', 'snow blower removal', 'garden tool disposal'],
    lead: 'Running or broken lawn mowers, trimmers, leaf blowers and other yard equipment cleared out of your garage or shed.',
    body: [
      'Old mowers and yard tools pile up in garages and sheds. Gas-powered equipment cannot go in the garbage, and most charities will not take it. We will.',
      'Please drain gas and oil before pickup. Working equipment is passed on for reuse; the rest is recycled as scrap metal.',
    ],
    takes: ['Gas & electric lawn mowers', 'Riding mowers', 'String trimmers', 'Leaf blowers', 'Snow blowers', 'Pressure washers', 'Wheelbarrows', 'Hand tools & hoses'],
    disposal: 'Working equipment is donated or resold for reuse. Broken equipment is recycled as scrap metal.',
    faqs: [
      { q: 'Do I need to drain the gas?', a: 'Yes. Fuel and oil should be drained before pickup - we cannot transport equipment with fuel in the tank.' },
    ],
    related: ['yard-waste-removal', 'shed-removal', 'garage-cleanout'],
    image: null,
    image2: null,
  },
  {
    slug: 'yard-waste-removal',
    name: 'Yard Waste Removal',
    category: 'household',
    h1: 'Yard Waste & Yard Debris Removal',
    title: 'Yard Waste & Debris Removal Vancouver',
    description: 'Yard waste and debris removal in Metro Vancouver. Branches, stumps, brush, soil and garden debris hauled away. Same-day available.',
    keywords: ['yard waste removal Vancouver', 'yard debris removal', 'branch removal', 'green waste pickup', 'garden waste removal', 'brush removal', 'soil removal'],
    lead: 'Branches, brush, stumps, leaves, sod and garden debris - loaded up and taken to a yard-waste facility after your cleanup.',
    body: [
      'Big yard projects create far more green waste than a city bin can handle. After a pruning job, storm cleanup or garden redo, we load everything onto our truck so you do not have to make multiple trips to the depot.',
      'Send us photos of the pile for a free estimate - we confirm the final price on-site before loading.',
    ],
    takes: ['Branches & brush', 'Tree trunks & stumps', 'Leaves & clippings', 'Hedge trimmings', 'Sod & soil', 'Weeds & plants', 'Rocks & landscaping stone', 'Old planters'],
    disposal: 'Green waste goes to yard-waste facilities to be composted or chipped. Clean soil and rock go to approved fill and aggregate sites.',
    faqs: [
      { q: 'How is yard waste priced?', a: 'Junk removal is priced by load size. Heavy material like soil, sod and rock costs more to haul, so we estimate from photos and confirm the price on-site.' },
      { q: 'Do you cut down trees?', a: 'No, we do not do tree cutting. We haul the branches, logs and debris after the work is done.' },
    ],
    related: ['fence-removal', 'shed-removal', 'concrete-removal'],
    image: { src: '/junk/yard-waste-removal.jpg', alt: 'Wheelbarrow beside a pile of branches, brush and old lumber waiting for yard waste removal', pos: 'center 72%' },
    image2: null,
  },
  {
    slug: 'playset-removal',
    name: 'Playset Removal',
    category: 'household',
    h1: 'Playset, Swing Set & Trampoline Removal',
    title: 'Swing Set & Trampoline Removal Vancouver',
    description: 'Playset, swing set, play structure and trampoline removal in Metro Vancouver. Dismantled and hauled out of your backyard.',
    keywords: ['playset removal', 'swing set removal Vancouver', 'trampoline removal', 'play structure disposal', 'backyard playground removal'],
    lead: 'Wooden play structures, metal swing sets and trampolines dismantled and cleared from your backyard.',
    body: [
      'Kids outgrow the swing set long before it falls apart. Wooden play structures are bolted together with dozens of fasteners and often set in concrete footings. Trampolines are bulky and awkward.',
      'We dismantle the structure, carry the pieces out and haul everything away in one visit.',
    ],
    takes: ['Wooden play structures', 'Metal swing sets', 'Trampolines & nets', 'Slides', 'Playhouses', 'Sandboxes', 'Basketball hoops'],
    disposal: 'Playsets in good condition can be donated. Metal frames are recycled, and treated wood is disposed of at approved facilities.',
    faqs: [
      { q: 'Do you dismantle the playset?', a: 'Yes. Dismantling is part of the job. Posts set in concrete may need extra time, which we will confirm in person.' },
    ],
    related: ['shed-removal', 'hot-tub-removal', 'yard-waste-removal'],
    image: { src: '/junk/playset-removal.jpg', alt: 'Old wooden backyard play structure with swings and slide, ready for playset removal', pos: 'center 85%' },
    image2: null,
  },
  {
    slug: 'household-junk-removal',
    name: 'Household Junk Removal',
    category: 'household',
    h1: 'Household Junk & Garbage Removal',
    title: 'Household Junk & Garbage Removal',
    description: 'Household junk and garbage removal in Metro Vancouver. Bags, boxes, clutter and everyday trash cleared from any room. Book same-day.',
    keywords: ['household junk removal', 'garbage removal Vancouver', 'trash removal', 'clutter removal', 'junk pickup near me', 'rubbish removal Vancouver'],
    lead: 'Bags of garbage, boxes of clutter, broken toys, old décor - the everyday junk that builds up, removed from every room.',
    body: [
      'Not every job is a single big item. Often it is the accumulation - bags in the garage, boxes in the closet, broken things nobody got around to dealing with. We sort, bag if needed, and haul it all.',
      'Just point to what needs to go. We do the lifting, loading and sweeping up after.',
    ],
    takes: ['Bags of household garbage', 'Boxes & clutter', 'Toys & sports gear', 'Clothing & linens', 'Kitchenware', 'Décor & frames', 'Luggage', 'Books & papers'],
    disposal: 'We sort as we load. Clothing, kitchenware and books in good shape are donated, recyclables are recycled, and only true garbage goes to the transfer station.',
    faqs: [
      { q: 'Do I need to bag everything?', a: 'No. Loose items are fine. We can bag small things as we load.' },
    ],
    related: ['garage-cleanout', 'basement-cleanout', 'residential-junk-removal'],
    image: { src: '/junk/household-junk-removal.jpg', alt: 'Pile of household clutter, bags, boxes and old items waiting for junk removal', pos: 'center 55%' },
    image2: { src: '/junk/household-junk-job.jpg', alt: 'Stonegate truck loaded with boxes and household junk during a pickup', pos: 'center 60%' },
  },
  {
    slug: 'cardboard-removal',
    name: 'Cardboard Removal',
    category: 'household',
    h1: 'Cardboard & Packing Material Removal',
    title: 'Cardboard & Moving Box Removal Vancouver',
    description: 'Cardboard removal after moves, renos and deliveries in Metro Vancouver. Boxes, packing paper and foam picked up and hauled away.',
    keywords: ['cardboard removal Vancouver', 'moving box pickup', 'moving box disposal', 'packing material removal', 'box pickup'],
    lead: 'Mountains of moving boxes, packing paper and delivery cardboard - picked up from your home or business and hauled away in one trip.',
    body: [
      'After a move, the cardboard never ends. Same goes for businesses with a backlog of shipping boxes. Blue-bin collection cannot keep up, so we take it all at once.',
      'Flattened or not - we load it either way. Packing paper and foam go in the same trip.',
    ],
    takes: ['Moving boxes', 'Shipping & delivery boxes', 'Packing paper', 'Styrofoam & foam packing', 'Bubble wrap', 'Pallets', 'Wardrobe boxes'],
    disposal: 'Cardboard and paper go directly to recycling. Foam and plastic packing are recycled where facilities accept them.',
    faqs: [
      { q: 'Do I need to flatten the boxes?', a: 'Flattening makes your load smaller and can lower your price, but it is not required.' },
    ],
    related: ['move-out-cleanout', 'commercial-junk-removal', 'household-junk-removal'],
    image: { src: '/junk/cardboard-removal.jpg', alt: 'Stonegate truck loaded with moving boxes and wardrobe boxes for cardboard removal', pos: 'center 72%' },
    image2: null,
  },

  // ───────────────────────── Cleanouts ─────────────────────────
  {
    slug: 'residential-junk-removal',
    name: 'Residential Junk Removal',
    category: 'cleanouts',
    h1: 'Residential Junk Removal in Metro Vancouver',
    title: 'Residential Junk Removal Vancouver',
    description: 'Full-service residential junk removal for houses, condos and apartments across Metro Vancouver. We do all the lifting. Same-day available.',
    keywords: ['residential junk removal', 'home junk removal Vancouver', 'house junk removal', 'condo junk removal', 'full-service junk removal', 'junk hauling'],
    lead: 'Full-service junk removal for houses, townhomes, condos and apartments - from any room, any floor, with no prep needed from you.',
    body: [
      'Residential junk removal is the core of what we do. Our two-person crew arrives in a 2-hour window, gives you a price in person, and removes everything you point to - from a single item to a whole-house cleanout.',
      'We know Metro Vancouver housing: tight condo elevators, steep North Shore driveways, basement suites with narrow stairs and laneway houses with limited parking. We plan for it so the job goes quickly.',
    ],
    takes: ['Furniture', 'Appliances', 'Mattresses', 'Electronics', 'Garage & basement junk', 'Yard waste', 'Renovation debris', 'Boxes & clutter'],
    disposal: 'Donation and recycling come first. We sort as we load, and drop items at charities, recyclers and transfer stations so as little as possible ends up in the landfill.',
    faqs: [
      { q: 'Do I need to be home?', a: 'We prefer someone is there to confirm the price and the items. For outdoor pickups, we can arrange payment in advance and work while you are out.' },
      { q: 'How fast can you come?', a: 'Same-day and next-day pickups are often available. Book online or call to see today\'s availability.' },
    ],
    related: ['household-junk-removal', 'garage-cleanout', 'basement-cleanout'],
    image: { src: '/junk/residential-junk-removal.jpg', alt: 'Stonegate truck packed with bags, bins, luggage and household items from a residential junk removal job', pos: 'center 62%' },
    image2: null,
  },
  {
    slug: 'commercial-junk-removal',
    name: 'Commercial Junk Removal',
    category: 'cleanouts',
    h1: 'Commercial Junk Removal in Metro Vancouver',
    title: 'Commercial Junk Removal Vancouver',
    description: 'Commercial junk removal for offices, retail, restaurants, warehouses and property managers across Metro Vancouver. Insured and flexible scheduling.',
    keywords: ['commercial junk removal Vancouver', 'business junk removal', 'warehouse cleanout', 'retail junk removal', 'property management junk removal', 'commercial waste removal'],
    lead: 'Junk removal for offices, retail stores, restaurants, warehouses and property managers - on your schedule, including after hours.',
    body: [
      'Businesses need junk removal that is fast, insured and does not interrupt operations. We work with offices, shops, restaurants, warehouses, contractors and property managers across Metro Vancouver.',
      'From a single pallet of old fixtures to a full warehouse clearout, we bring a truck with 29 cubic yards of space and a crew that works quickly and professionally.',
    ],
    takes: ['Office furniture', 'Retail fixtures & shelving', 'Pallets & racking', 'Restaurant equipment', 'E-waste & IT equipment', 'Cardboard & packaging', 'Tenant leftovers', 'Construction debris'],
    disposal: 'We prioritize reuse and recycling - metal racking, e-waste, cardboard and usable furniture are all diverted from the landfill.',
    faqs: [
      { q: 'Do you work with property managers?', a: 'Yes. We regularly clear out units after tenants leave, as well as common areas, parkades and storage rooms.' },
      { q: 'Can you provide a certificate of insurance?', a: 'Yes, on request for buildings that require it.' },
    ],
    related: ['office-cleanout', 'office-furniture-removal', 'construction-debris-removal'],
    image: { src: '/junk/commercial-junk-disposal.jpg', alt: 'Stonegate junk removal truck dropping off a commercial load at the disposal facility', pos: 'center 55%' },
    image2: { src: '/junk/commercial-junk-loading.jpg', alt: 'Stonegate crew member loading pallets and crates into the truck during a commercial cleanout', pos: 'center 60%' },
    beforeAfter: {
      before: { src: '/junk-before-warehouse.jpg', alt: 'Warehouse cluttered with pallets, old electronics and boxes before commercial junk removal' },
      after: { src: '/junk-after-warehouse.jpg', alt: 'Same warehouse cleared and swept after the Stonegate commercial cleanout' },
      caption: 'A Metro Vancouver warehouse cleared in a single visit.',
    },
  },
  {
    slug: 'garage-cleanout',
    name: 'Garage Cleanout',
    category: 'cleanouts',
    h1: 'Garage Cleanout Services in Metro Vancouver',
    title: 'Garage Cleanout & Junk Removal Vancouver',
    description: 'Garage cleanouts across Metro Vancouver. Old tools, boxes, bikes, furniture and junk cleared so you can park inside again. Free quote.',
    keywords: ['garage cleanout Vancouver', 'garage junk removal', 'garage cleanup', 'garage decluttering', 'garage clean out service'],
    lead: 'Years of boxes, broken tools, old bikes and things you forgot you owned - cleared out so your car can finally live in the garage again.',
    body: [
      'The garage is where things go when nobody knows what to do with them. A garage cleanout is one of the most satisfying jobs we do - usually done in a couple of hours, and the difference is immediate.',
      'You tell us what stays and what goes. We sort as we load, sweep up after, and send everything usable to donation.',
    ],
    takes: ['Boxes & bins', 'Old tools & workbenches', 'Bikes & sports equipment', 'Shelving units', 'Old furniture', 'Lawn & garden equipment', 'Tires (no rims needed)', 'Scrap metal'],
    disposal: 'Tools, bikes and sports gear in good shape are donated. Metal is recycled, and the rest is sorted for proper disposal.',
    faqs: [
      { q: 'Can you help decide what to keep?', a: 'Our crew works with you on site. Point to what goes, and we will set aside anything you are unsure about.' },
      { q: 'Do you take paint and chemicals?', a: 'No - paint, solvents and chemicals are hazardous waste. We can point you to the nearest return depot.' },
    ],
    related: ['basement-cleanout', 'attic-cleanout', 'lawn-mower-removal'],
    image: { src: '/junk/garage-cleanout.jpg', alt: 'Cluttered garage full of boxes, rolled carpet, flooring offcuts and tires before a garage cleanout', pos: 'center 55%' },
    image2: null,
  },
  {
    slug: 'basement-cleanout',
    name: 'Basement Cleanout',
    category: 'cleanouts',
    h1: 'Basement Cleanout Services',
    title: 'Basement Cleanout & Junk Removal Vancouver',
    description: 'Basement cleanouts across Metro Vancouver. Furniture, boxes, appliances and clutter carried up and hauled away. Same-day available.',
    keywords: ['basement cleanout Vancouver', 'basement junk removal', 'basement cleanup', 'basement suite cleanout', 'basement decluttering'],
    lead: 'Everything in the basement - furniture, boxes, old appliances, gym equipment - carried up the stairs and hauled away.',
    body: [
      'Basements collect the heaviest junk in the house and have the worst access: narrow stairs, low ceilings and tight corners. That is exactly where a trained crew makes the biggest difference.',
      'Getting a basement suite ready for a new tenant, preparing to sell, or just reclaiming the space? We clear it out completely.',
    ],
    takes: ['Old furniture', 'Boxes & storage bins', 'Appliances & water heaters', 'Exercise equipment', 'Carpet & flooring', 'Old electronics', 'Holiday decorations', 'Tenant leftovers'],
    disposal: 'We sort for donation and recycling as we carry things up, so usable items get a second life.',
    faqs: [
      { q: 'Can you clear a basement suite after a tenant leaves?', a: 'Yes. Tenant move-out cleanouts are a regular job for us across Metro Vancouver.' },
    ],
    related: ['garage-cleanout', 'attic-cleanout', 'exercise-equipment-removal'],
    image: null,
    image2: null,
  },
  {
    slug: 'attic-cleanout',
    name: 'Attic Cleanout',
    category: 'cleanouts',
    h1: 'Attic & Crawl Space Cleanout',
    title: 'Attic & Crawl Space Cleanout Vancouver',
    description: 'Attic and crawl space cleanouts in Metro Vancouver. Boxes, old furniture and storage clutter brought down and hauled away safely.',
    keywords: ['attic cleanout', 'attic junk removal Vancouver', 'crawl space cleanout', 'attic cleanup', 'storage room cleanout'],
    lead: 'Boxes, old furniture and forgotten storage brought down from attics, lofts and crawl spaces - without you climbing the ladder.',
    body: [
      'Attics and crawl spaces are hot, dusty and cramped - and everything has to come down a ladder or through a small hatch. Our crew handles the awkward part.',
      'We bring items down carefully, protect the floors below and haul it all away in one trip.',
    ],
    takes: ['Storage boxes', 'Old furniture', 'Holiday decorations', 'Luggage', 'Old clothing & linens', 'Paperwork & files', 'Toys & keepsakes', 'Crawl-space debris'],
    disposal: 'Clothing, linens and household goods are donated where possible. Paper is recycled.',
    faqs: [
      { q: 'Do you remove insulation?', a: 'No. Insulation removal - especially older vermiculite - needs a specialist. We remove stored items and debris only.' },
    ],
    related: ['basement-cleanout', 'garage-cleanout', 'estate-cleanout'],
    image: null,
    image2: null,
  },
  {
    slug: 'estate-cleanout',
    name: 'Estate Cleanout',
    category: 'cleanouts',
    h1: 'Estate Cleanout Services in Metro Vancouver',
    title: 'Estate Cleanout Services Vancouver',
    description: 'Respectful estate cleanouts across Metro Vancouver. Full-home clear-outs for families, executors and realtors. Donation-first. Free estimate.',
    keywords: ['estate cleanout Vancouver', 'estate cleanup', 'estate clear out', 'deceased estate cleanout', 'probate cleanout', 'whole house cleanout', 'downsizing cleanout'],
    lead: 'Patient, respectful full-home cleanouts for families, executors and realtors - with valuables and keepsakes set aside, and usable belongings donated.',
    body: [
      'Clearing out a loved one\'s home is emotional and overwhelming. We work at your pace, set aside anything you flag - photos, documents, jewellery - and make sure belongings in good condition go to people who can use them.',
      'We handle full estates from top to bottom: furniture, appliances, clothing, kitchenware, garage and yard. Executors and realtors can arrange access and we will coordinate the rest.',
    ],
    takes: ['Full-home contents', 'Furniture & mattresses', 'Appliances', 'Clothing & linens', 'Kitchenware', 'Books & papers', 'Garage & shed contents', 'Yard items'],
    disposal: 'Estate cleanouts are donation-first. Furniture, clothing and household goods go to local charities, and the remainder is recycled or disposed of responsibly.',
    faqs: [
      { q: 'Can you work with the executor or realtor?', a: 'Yes. We can coordinate access, timing and payment directly with the executor, family or realtor.' },
      { q: 'What happens to personal documents?', a: 'We set aside any photos, documents or valuables we find and give them to you. Nothing personal is thrown away without your approval.' },
    ],
    related: ['hoarder-cleanout', 'foreclosure-cleanout', 'furniture-removal'],
    image: { src: '/junk/estate-cleanout.jpg', alt: 'Large pile of bins, lumber, tarps and household belongings outside a property before an estate cleanout', pos: 'center 60%' },
    image2: { src: '/hero-truck.jpg', alt: 'Stonegate truck parked in front of a house for an estate cleanout', pos: '70% center' },
    beforeAfter: {
      before: { src: '/junk-before-livingroom.png', alt: 'Living room full of furniture before an estate cleanout' },
      after: { src: '/junk-after-livingroom.png', alt: 'Same living room emptied and cleaned after the Stonegate cleanout' },
      caption: 'A full living room cleared out, ready for the next chapter.',
    },
  },
  {
    slug: 'hoarder-cleanout',
    name: 'Hoarder Cleanout',
    category: 'cleanouts',
    h1: 'Hoarder Cleanout & Hoarding Cleanup',
    title: 'Hoarder Cleanout Services Vancouver',
    description: 'Discreet, judgment-free hoarder cleanouts across Metro Vancouver. Full-home clutter removal for families and property managers.',
    keywords: ['hoarder cleanout Vancouver', 'hoarding cleanup', 'hoarder house cleanup', 'clutter cleanout', 'extreme cleanout'],
    lead: 'Discreet, judgment-free clearing of hoarded homes, apartments and units - at a pace that works for you and your family.',
    body: [
      'Hoarding situations need patience and discretion. We work quietly, respect the person whose home it is, and set aside anything that matters as we go.',
      'Large hoarding cleanouts may take multiple truckloads or multiple days. We plan it with you in advance so there are no surprises on price or timing.',
    ],
    takes: ['Accumulated clutter', 'Papers & magazines', 'Bags & boxes', 'Furniture', 'Appliances', 'Clothing', 'Household garbage'],
    disposal: 'We sort as much as possible for donation and recycling, even in a large cleanout.',
    faqs: [
      { q: 'Do you handle biohazard cleanup?', a: 'No. We remove clutter, furniture and household junk. Sites with biohazards, needles or animal waste need a specialist cleaning company first.' },
      { q: 'Will your truck be marked?', a: 'Our truck is branded, but our crew works discreetly and does not discuss the job with neighbours.' },
    ],
    related: ['estate-cleanout', 'apartment-cleanout', 'household-junk-removal'],
    image: null,
    image2: null,
  },
  {
    slug: 'foreclosure-cleanout',
    name: 'Foreclosure Cleanout',
    category: 'cleanouts',
    h1: 'Foreclosure & Eviction Cleanouts',
    title: 'Foreclosure & Eviction Cleanouts Vancouver',
    description: 'Foreclosure, eviction and abandoned-property cleanouts for landlords, banks and property managers in Metro Vancouver. Fast turnaround.',
    keywords: ['foreclosure cleanout', 'eviction cleanout Vancouver', 'abandoned property cleanout', 'rental property cleanout', 'landlord junk removal', 'tenant junk removal'],
    lead: 'Fast clear-outs of foreclosed, abandoned and post-eviction properties so landlords and property managers can get units back on the market.',
    body: [
      'Every vacant day costs money. We clear foreclosed homes and units left full by tenants quickly, so cleaners, painters and trades can start right away.',
      'We work directly with landlords, property managers and realtors, and can send before-and-after photos for your records.',
    ],
    takes: ['Abandoned furniture', 'Tenant belongings (once legally released)', 'Appliances', 'Garbage & debris', 'Mattresses', 'Yard junk'],
    disposal: 'Usable items are donated, and everything else is recycled or disposed of at approved facilities.',
    faqs: [
      { q: 'Can you send photos when the job is done?', a: 'Yes. We can send before-and-after photos for landlords and property managers who are not on site.' },
    ],
    related: ['estate-cleanout', 'apartment-cleanout', 'commercial-junk-removal'],
    image: null,
    image2: null,
  },
  {
    slug: 'storage-unit-cleanout',
    name: 'Storage Unit Cleanout',
    category: 'cleanouts',
    h1: 'Storage Unit & Locker Cleanout',
    title: 'Storage Unit Cleanout Vancouver',
    description: 'Storage unit and storage locker cleanouts in Metro Vancouver. Stop paying for junk - we empty the unit and haul it all away.',
    keywords: ['storage unit cleanout Vancouver', 'storage locker cleanout', 'storage unit junk removal', 'self storage cleanout', 'condo storage locker cleanout'],
    lead: 'Stop paying monthly rent on things you do not need. We empty self-storage units and condo storage lockers in one trip.',
    body: [
      'Storage units have a way of becoming permanent. If you have been paying to store furniture and boxes you will never use, a one-time cleanout pays for itself in a few months.',
      'We work at self-storage facilities and condo storage cages across Metro Vancouver. Meet us there, or arrange access, and we will clear it out.',
    ],
    takes: ['Furniture', 'Boxes & bins', 'Mattresses', 'Appliances', 'Sports equipment', 'Business inventory', 'Condo storage locker contents'],
    disposal: 'We sort for donation and recycling on the spot, and haul the rest away for proper disposal.',
    faqs: [
      { q: 'Can you do just part of a unit?', a: 'Yes. Show us what goes, and we will leave the rest neatly in place.' },
    ],
    related: ['apartment-cleanout', 'move-out-cleanout', 'furniture-removal'],
    image: { src: '/junk/storage-unit-cleanout.jpg', alt: 'Open self-storage unit packed with appliances, boxes and garbage bags before a storage unit cleanout', pos: 'center 60%' },
    image2: null,
  },
  {
    slug: 'apartment-cleanout',
    name: 'Apartment & Condo Cleanout',
    category: 'cleanouts',
    h1: 'Apartment & Condo Cleanout',
    title: 'Apartment & Condo Junk Removal Vancouver',
    description: 'Apartment and condo junk removal in Vancouver and Metro Vancouver. Elevator bookings handled, floors protected, everything hauled away.',
    keywords: ['apartment junk removal Vancouver', 'condo cleanout', 'apartment cleanout', 'condo junk removal', 'high-rise junk removal'],
    lead: 'Condo and apartment cleanouts done properly - elevator booked, hallways protected, and every item carried down for you.',
    body: [
      'Apartment junk removal in Metro Vancouver comes with its own rules: elevator reservations, move-in/move-out hours, loading zones and strata fees for damage. We work in towers and walk-ups every week and know how to do it cleanly.',
      'Book your elevator for the time window we give you and we take care of the rest - furniture, mattresses, balcony items and storage locker contents included.',
    ],
    takes: ['Furniture & mattresses', 'Balcony furniture', 'Storage locker contents', 'Small appliances', 'Electronics', 'Boxes & clutter'],
    disposal: 'Usable items go to donation partners; the rest is recycled or disposed of properly.',
    faqs: [
      { q: 'Do I need to book the elevator?', a: 'Most buildings require it. Book the service elevator for the time window we confirm, and let us know any building rules.' },
    ],
    related: ['move-out-cleanout', 'storage-unit-cleanout', 'furniture-removal'],
    image: null,
    image2: null,
  },
  {
    slug: 'move-out-cleanout',
    name: 'Move-Out Cleanout',
    category: 'cleanouts',
    h1: 'Move-Out Junk Removal & Cleanout',
    title: 'Move-Out Junk Removal Vancouver',
    description: 'Move-out cleanouts in Metro Vancouver. Everything you are not taking - furniture, boxes, junk - hauled away before or after your move.',
    keywords: ['move-out junk removal', 'moving cleanout Vancouver', 'house moving cleanout', 'apartment move-out cleanout', 'pre-move decluttering', 'post-move junk removal'],
    lead: 'Everything you are not taking with you - hauled away before or after moving day so you hand over the keys to an empty home.',
    body: [
      'Moving is the best time to get rid of things - and the worst time to deal with it yourself. Since we are also a moving company, we can handle both: move what you keep, and haul away what you do not.',
      'Book a pre-move cleanout to lighten your move (and lower your moving cost), or a post-move cleanout for whatever gets left behind.',
    ],
    takes: ['Furniture you are not taking', 'Mattresses', 'Appliances', 'Boxes & packing material', 'Garage & storage junk', 'Leftover garbage'],
    disposal: 'Donation-first, then recycling, then disposal.',
    faqs: [
      { q: 'Can you do the move and the junk removal together?', a: 'Yes. We are a moving and junk removal company. Ask about booking both - it saves time and coordination.' },
    ],
    related: ['apartment-cleanout', 'cardboard-removal', 'storage-unit-cleanout'],
    image: { src: '/junk/move-out-cleanout.jpg', alt: 'Stonegate truck loaded with boxes, bins and furniture outside a condo building on move-out day', pos: 'center 72%' },
    image2: { src: '/junk/move-out-cleanout-2.jpg', alt: 'Stonegate crew loading boxes into the truck during a move-out cleanout', pos: 'center 60%' },
  },
  {
    slug: 'office-cleanout',
    name: 'Office Cleanout',
    category: 'cleanouts',
    h1: 'Office Cleanout Services in Metro Vancouver',
    title: 'Office Cleanout Services Vancouver',
    description: 'Office cleanouts in Metro Vancouver. Desks, chairs, computers, printers, files and storage cleared. After-hours and weekend service.',
    keywords: ['office cleanout Vancouver', 'office junk removal', 'office clear out', 'office decommissioning', 'commercial cleanout', 'office move-out junk removal'],
    lead: 'Desks, chairs, computers, printers, filing cabinets and storage rooms - cleared out after hours or on weekends so business never stops.',
    body: [
      'Office cleanouts happen during moves, renovations, downsizing and lease ends. We clear entire floors or a single storage room, and we coordinate with building management on elevators and loading docks.',
      'E-waste goes to approved electronics recyclers, metal furniture is recycled and usable furniture is passed on for reuse.',
    ],
    takes: ['Desks & chairs', 'Cubicles', 'Filing cabinets', 'Computers & monitors', 'Printers & copiers', 'Books & binders', 'Couches & lounge furniture', 'Kitchen appliances'],
    disposal: 'E-waste is recycled at approved depots, metal is recycled, and usable furniture is donated.',
    faqs: [
      { q: 'Do you shred documents?', a: 'We do not provide certified shredding. Please have confidential documents shredded first - we can then haul the paper for recycling.' },
    ],
    related: ['office-furniture-removal', 'electronics-removal', 'commercial-junk-removal'],
    image: { src: '/junk/office-cleanout.jpg', alt: 'Office desks, chairs and pedestal cabinets ready for an office cleanout' },
    image2: null,
  },

  // ───────────────────────── Construction ─────────────────────────
  {
    slug: 'construction-debris-removal',
    name: 'Construction Debris Removal',
    category: 'construction',
    h1: 'Construction & Renovation Debris Removal',
    title: 'Construction Debris Removal Vancouver',
    description: 'Construction and renovation debris removal in Metro Vancouver. Drywall, lumber, cabinets, tile and reno waste hauled away. Free estimate.',
    keywords: ['construction debris removal Vancouver', 'renovation waste removal', 'reno junk removal', 'drywall disposal', 'lumber removal', 'contractor debris removal', 'construction waste pickup'],
    lead: 'Drywall, lumber, cabinets, tile, fixtures and reno waste - loaded and hauled away for homeowners and contractors without a bin sitting on your driveway.',
    body: [
      'A disposal bin takes up your driveway for days and you still have to load it yourself. We show up, load the debris and leave - usually in under an hour or two.',
      'Send us photos of the debris for a free estimate. We confirm the final price on-site before loading, so contractors and homeowners know the cost up front.',
    ],
    takes: ['Drywall & plaster', 'Lumber & framing', 'Kitchen cabinets & counters', 'Tile & flooring', 'Doors & windows', 'Toilets, sinks & tubs', 'Insulation (non-hazardous)', 'Glass & mirrors'],
    disposal: 'Wood, metal and clean drywall are separated for recycling. Mixed debris goes to approved construction waste facilities.',
    faqs: [
      { q: 'How is construction debris removal priced?', a: 'Junk removal is priced by load size. Heavy debris like tile and plaster costs more to haul, so we estimate from photos and confirm the price on-site before we start.' },
      { q: 'Do you take asbestos or lead paint?', a: 'No. Materials suspected to contain asbestos must be tested and removed by a licensed abatement company.' },
    ],
    related: ['concrete-removal', 'deck-removal', 'scrap-metal-removal'],
  },
  {
    slug: 'concrete-removal',
    name: 'Concrete Removal',
    category: 'construction',
    h1: 'Concrete, Brick & Rubble Removal',
    title: 'Concrete & Rubble Removal Vancouver',
    description: 'Concrete, brick, asphalt and rubble removal in Metro Vancouver. Broken-up concrete and pavers hauled away. Free estimate from photos.',
    keywords: ['concrete removal Vancouver', 'concrete disposal', 'rubble removal', 'brick removal', 'paver removal', 'asphalt disposal', 'broken concrete pickup'],
    lead: 'Broken concrete, bricks, pavers, rubble and rock loaded and hauled away by our crew.',
    body: [
      'Concrete is one of the heaviest materials there is, and loading it by hand is brutal work. We handle broken-up slabs, patio stones, bricks, blocks and rubble from demolition and landscaping projects.',
      'Concrete is dense and heavy, so the price depends on how much there is. Send us photos for a free estimate and we confirm the final price on-site before we start.',
    ],
    takes: ['Broken concrete', 'Bricks & blocks', 'Patio stones & pavers', 'Asphalt', 'Rock & gravel', 'Rubble', 'Concrete planters & bases'],
    disposal: 'Clean concrete and brick go to aggregate recyclers where they are crushed and reused for new construction.',
    faqs: [
      { q: 'Do you break up concrete slabs?', a: 'We haul concrete that is already broken into liftable pieces. Breaking a slab is a demolition job - contact us and we can discuss the project.' },
      { q: 'How is concrete removal priced?', a: 'Junk removal is priced by load size. Because concrete is heavy, we estimate from photos and confirm the price on-site before loading.' },
    ],
    related: ['construction-debris-removal', 'yard-waste-removal', 'deck-removal'],
    image: { src: '/junk/concrete-removal.jpg', alt: 'Pile of broken concrete, bricks and rubble ready for concrete removal' },
    image2: null,
  },
  {
    slug: 'deck-removal',
    name: 'Deck Removal',
    category: 'construction',
    h1: 'Deck Removal & Demolition',
    title: 'Deck Removal & Demolition Vancouver',
    description: 'Old deck removal and demolition across Metro Vancouver. Rotted boards, railings, stairs and framing torn out and hauled away.',
    keywords: ['deck removal Vancouver', 'deck demolition', 'old deck tear down', 'deck disposal', 'rotten deck removal'],
    lead: 'Rotted decks, railings and stairs torn out and hauled away so you can start fresh.',
    body: [
      'The wet coast climate is hard on wooden decks. When the boards are soft and the railings wobble, it is time to start over. We tear out the decking, railings and framing and haul it all away.',
      'Already demolished it yourself? We will just load and haul the pile.',
    ],
    takes: ['Deck boards', 'Railings & stairs', 'Joists & framing', 'Composite decking', 'Deck footings (pre-broken)', 'Pergolas'],
    disposal: 'Untreated wood goes to wood-waste processing, metal hardware is recycled and treated wood is disposed of at approved facilities.',
    faqs: [
      { q: 'Do you demolish the deck or just haul it?', a: 'Both. We can tear out an existing deck or just load and haul debris you have already removed. Demolition is confirmed in person.' },
    ],
    related: ['fence-removal', 'shed-removal', 'hot-tub-removal'],
    image: { src: '/junk/deck-removal.jpg', alt: 'Wooden backyard deck with railings and stairs, the kind we tear out and haul away during deck removal', pos: 'center 70%' },
    image2: null,
  },
  {
    slug: 'shed-removal',
    name: 'Shed Removal',
    category: 'construction',
    h1: 'Shed Removal & Demolition',
    title: 'Shed Removal & Demolition Vancouver',
    description: 'Shed removal and demolition in Metro Vancouver. Wood, metal and plastic sheds - plus their contents - torn down and hauled away.',
    keywords: ['shed removal Vancouver', 'shed demolition', 'shed tear down', 'old shed disposal', 'metal shed removal', 'garden shed removal'],
    lead: 'Wood, metal and plastic garden sheds - and everything inside them - torn down and hauled away in a single visit.',
    body: [
      'An old shed full of old things is a two-part job. We empty the contents first, then dismantle the shed itself, and haul all of it away together.',
      'Metal and plastic sheds come apart quickly. Wooden sheds with floors and roofing take longer - we will confirm the scope and price in person.',
    ],
    takes: ['Wooden sheds', 'Metal sheds', 'Plastic & resin sheds', 'Shed contents', 'Playhouses', 'Greenhouses', 'Carports'],
    disposal: 'Metal sheds are recycled. Wood is processed as wood waste, and contents are sorted for donation and recycling.',
    faqs: [
      { q: 'Do you remove the shed floor or foundation?', a: 'We remove wooden floors and skids. Concrete pads are a separate job we can quote in person.' },
    ],
    related: ['deck-removal', 'fence-removal', 'playset-removal'],
    image: { src: '/junk/shed-removal-job.jpg', alt: 'Old weathered wooden garden shed in a Metro Vancouver backyard before shed removal', pos: 'center 55%' },
    image2: { src: '/junk/shed-removal.jpg', alt: 'Weathered old wooden shed with a metal roof, ready for shed removal and demolition', pos: 'center 45%' },
  },
  {
    slug: 'fence-removal',
    name: 'Fence Removal',
    category: 'construction',
    h1: 'Fence Removal & Disposal',
    title: 'Fence Removal & Disposal Vancouver',
    description: 'Old fence removal and disposal in Metro Vancouver. Wood, chain-link and vinyl fencing, posts and gates torn out and hauled away.',
    keywords: ['fence removal Vancouver', 'fence disposal', 'old fence tear down', 'chain link fence removal', 'fence post removal', 'fence debris removal'],
    lead: 'Wood, chain-link and vinyl fencing, gates and posts torn out or loaded up and hauled away.',
    body: [
      'Replacing a fence leaves you with a long pile of heavy boards, posts and hardware. We haul it all - whether your fencing contractor left it behind or you need us to take the old fence down.',
      'We did exactly that for this backyard: the old cedar fence was cleared and hauled in a single trip, leaving a clean side yard behind.',
    ],
    takes: ['Wood fence panels', 'Fence posts', 'Chain-link fencing', 'Vinyl fencing', 'Gates', 'Lattice & trellis', 'Post concrete (pre-broken)'],
    disposal: 'Wood is sent for wood-waste processing, and metal posts and chain-link are recycled.',
    faqs: [
      { q: 'Can you remove fence posts set in concrete?', a: 'Posts with concrete footings take extra time and are heavy. We will look at them and confirm in person.' },
    ],
    related: ['deck-removal', 'yard-waste-removal', 'construction-debris-removal'],
    image: { src: '/junk-before-fence.jpg', alt: 'Old fence boards and posts piled in a side yard before removal' },
    image2: { src: '/junk-after-fence-v2.jpg', alt: 'Side yard cleared after fence debris removal' },
  },
  {
    slug: 'scrap-metal-removal',
    name: 'Scrap Metal Removal',
    category: 'construction',
    h1: 'Scrap Metal Removal & Pickup',
    title: 'Scrap Metal Removal & Pickup Vancouver',
    description: 'Scrap metal removal and pickup in Metro Vancouver. Steel, aluminum, copper, cast iron, auto parts and old metal furniture hauled away.',
    keywords: ['scrap metal removal Vancouver', 'scrap metal pickup', 'old metal haul away', 'cast iron tub removal', 'auto parts disposal', 'old metal disposal'],
    lead: 'Steel, aluminum, copper, cast-iron tubs, auto parts and old metal furniture - carried out and hauled away by our crew.',
    body: [
      'Scrap metal is the most recyclable thing we haul. Old bed frames, shelving, radiators, cast-iron bathtubs, auto parts - all of it can be melted down and reused.',
      'Cast-iron tubs and radiators are very heavy; we bring the crew and equipment to move them safely.',
    ],
    takes: ['Steel & aluminum', 'Copper & wiring', 'Cast-iron tubs & radiators', 'Auto parts & rims', 'Metal shelving', 'Bed frames', 'Bikes', 'Metal roofing & siding'],
    disposal: 'All of it goes to a metal recycler.',
    faqs: [
      { q: 'Do you pay for scrap metal?', a: 'No - we are a junk removal service, not a scrap buyer. Our price covers the labour, truck and drop-off.' },
    ],
    related: ['construction-debris-removal', 'water-heater-removal', 'appliance-removal'],
    image: { src: '/junk/scrap-metal-removal.jpg', alt: 'Pile of scrap metal - steel bars, brackets, panels and cable - ready for scrap metal removal' },
    image2: null,
  },
]

export const JUNK_ITEM_BY_SLUG = new Map(JUNK_ITEMS.map(i => [i.slug, i]))

export function junkItemHref(slug: string) {
  return `/junk-removal/${slug}`
}

export function itemsInCategory(id: JunkCategoryId) {
  return JUNK_ITEMS.filter(i => i.category === id)
}

export function categoryOf(id: JunkCategoryId) {
  return JUNK_CATEGORIES.find(c => c.id === id)!
}

/** Explicit related links first, then category siblings, deduped, max `limit`. */
export function relatedItems(item: JunkItem, limit = 8): JunkItem[] {
  const seen = new Set([item.slug])
  const out: JunkItem[] = []
  const push = (i?: JunkItem) => {
    if (i && !seen.has(i.slug) && out.length < limit) { seen.add(i.slug); out.push(i) }
  }
  item.related?.forEach(s => push(JUNK_ITEM_BY_SLUG.get(s)))
  itemsInCategory(item.category).forEach(push)
  return out
}

export function itemImages(item: JunkItem): [SeoImage | null, SeoImage | null] {
  const [a, b] = categoryOf(item.category).fallback
  return [item.image === undefined ? a : item.image, item.image2 === undefined ? b : item.image2]
}

/** Most-searched items - used for city pages and other cross-link spots */
export const POPULAR_JUNK_SLUGS = [
  'furniture-removal', 'couch-removal', 'mattress-removal', 'appliance-removal',
  'refrigerator-removal', 'hot-tub-removal', 'garage-cleanout', 'estate-cleanout',
  'construction-debris-removal', 'electronics-removal', 'yard-waste-removal', 'office-cleanout',
]
