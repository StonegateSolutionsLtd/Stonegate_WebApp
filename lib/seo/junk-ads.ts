import type { SeoImage } from './site'
import { JUNK_ITEMS, itemImages, type JunkItem, type JunkCategoryId } from './junk-items'

/**
 * Landing page config for every /junk-removal/[slug] page (item photo + real crew photo in
 * the hero, CTAs above the fold). The Google Ads pages have hand-written config in JUNK_ADS;
 * every other item page gets one built from its item data by junkAdFor().
 */
export interface JunkAd {
  /** Big H1 line - matches the ad keyword */
  headline: string
  /** One-line promise under the headline */
  promise: string
  /** Photo of the thing being removed - never covered by overlays */
  itemPhoto: SeoImage & { label: string }
  /** Hero portrait of the crew (a person or the team - not carrying unrelated items) */
  crewPhoto: SeoImage
  /** "Who shows up" section photo - different from crewPhoto and from every other page */
  teamPhoto: SeoImage
  /** Three short service-specific reasons, shown as checkmarks in the hero */
  highlights: [string, string, string]
  /** Before/after slider pair to show first, by label (see beforeAfterPairs) */
  sliderFirst?: string
}

// Photos are spread across the ad pages so they don't repeat - except the cab-door shot (4580), which the owner wants used more
const CREW_PHOTOS = {
  besideTruck: { src: '/junk/driver-beside-truck.png', alt: 'Stonegate crew member standing at the back of the Stonegate truck', pos: 'center 40%' },
  homeLoading: { src: '/about/photo-4.jpg', alt: 'Stonegate crew member loading the truck with a hand dolly outside a home', pos: 'center 55%' },
  byTruck: { src: '/junk/crew-4628-by-truck.jpg', alt: 'Stonegate crew member standing beside the branded Stonegate truck', pos: '58% center' },
  ramp: { src: '/crew-loading-ramp.jpg', alt: 'Stonegate crew member sliding out the truck ramp to load heavy appliances', pos: 'center 55%' },
  inCab: { src: '/junk/driver-cab-4534-mobile.jpg', alt: 'Smiling Stonegate driver in the cab of the junk removal truck', pos: 'center 40%' },
  onRamp: { src: '/about/photo-2.jpg', alt: 'Stonegate crew member standing on the truck ramp', pos: 'center 45%' },
  inTruck: { src: '/junk/crew-4586-in-truck.jpg', alt: 'Smiling Stonegate crew member standing in the back of the junk removal truck', pos: 'center 45%' },
  tailgate: { src: '/junk/crew-4543-tailgate.jpg', alt: 'Stonegate crew member on the tailgate of the branded Stonegate truck', pos: 'center 60%' },
  walking: { src: '/crew-walking-truck.jpg', alt: 'Stonegate crew member walking beside the branded Stonegate truck', pos: 'center 55%' },
  cabDoor: { src: '/junk/crew-4539-cab.jpg', alt: 'Friendly Stonegate driver stepping out of the junk removal truck cab', pos: 'center 45%' },
  teamOnRoof: { src: '/about/photo-6.png', alt: 'The Stonegate crew sitting on top of the branded Stonegate truck', pos: 'center 42%' },
  loadedTruck: { src: '/junk/crew-4572-loaded-truck.jpg', alt: 'Stonegate crew member standing in the back of a fully loaded Stonegate truck', pos: 'center 55%' },
  byCab: { src: '/junk/crew-4580-by-cab.jpg', alt: 'Stonegate crew member standing beside the cab of the Stonegate truck', pos: 'center 62%' },
  team: { src: '/team-with-truck.jpg', alt: 'Three Stonegate crew members standing in front of the branded Stonegate truck', pos: '62% center' },
  truckSide: { src: '/junk/crew-4557-truck-side.jpg', alt: 'Branded Stonegate junk removal truck with a crew member loading the back', pos: 'center 55%' },
} satisfies Record<string, SeoImage>

export const JUNK_ADS: Record<string, JunkAd> = {
  'mattress-removal': {
    headline: 'Mattress Removal',
    promise: 'We carry your old mattress out of any room and take it to a recycler. You don’t lift a thing.',
    itemPhoto: { src: '/junk/mattress-removal.jpg', alt: 'Old mattress on a bed frame, ready for mattress removal', pos: 'center 60%', label: 'Old mattresses' },
    crewPhoto: CREW_PHOTOS.besideTruck,
    teamPhoto: CREW_PHOTOS.homeLoading,
    highlights: ['Box springs & bed frames too', 'Any floor, stairs or no elevator', 'Recycled - not left on the curb'],
    sliderFirst: 'Living room',
  },
  'appliance-removal': {
    headline: 'Appliance Removal',
    promise: 'Fridges, washers, dryers, stoves and more - disconnected, carried out and recycled.',
    itemPhoto: { src: '/junk/appliance-removal.jpg', alt: 'Old stoves, ovens and a water tank waiting for appliance removal', pos: 'center 45%', label: 'Fridges, stoves, washers' },
    crewPhoto: CREW_PHOTOS.byTruck,
    teamPhoto: CREW_PHOTOS.ramp,
    highlights: ['Heavy-duty dollies & straps', 'Fridges & freezers recycled properly', 'From basements, kitchens & laundry rooms'],
  },
  'furniture-removal': {
    headline: 'Furniture Removal',
    promise: 'Couches, beds, dressers, tables - our crew lifts it, carries it out and hauls it away.',
    itemPhoto: { src: '/junk/furniture-removal-2.jpg', alt: 'Two worn recliners left outside, waiting for furniture removal', pos: 'center 45%', label: 'Couches, beds, dressers' },
    crewPhoto: CREW_PHOTOS.inCab,
    teamPhoto: CREW_PHOTOS.onRamp,
    highlights: ['Sectionals & sofa beds - no problem', 'We take it apart if it won’t fit', 'Usable pieces donated'],
    sliderFirst: 'Living room',
  },
  'household-junk-removal': {
    headline: 'Household Junk Removal',
    promise: 'Bags, boxes, clutter and old stuff from every room - gone in one visit.',
    itemPhoto: { src: '/junk/household-junk-removal.jpg', alt: 'Pile of household clutter, bags and boxes waiting for junk removal', pos: 'center 55%', label: 'Bags, boxes & clutter' },
    crewPhoto: CREW_PHOTOS.inTruck,
    teamPhoto: CREW_PHOTOS.tailgate,
    highlights: ['One item or a full truckload', 'We load it from inside your home', 'Donate & recycle first'],
    sliderFirst: 'Living room',
  },
  'shed-removal': {
    headline: 'Shed Removal',
    promise: 'Wood, metal or plastic sheds torn down and hauled away - contents included.',
    itemPhoto: { src: '/junk/shed-removal.jpg', alt: 'Weathered old wooden shed ready for shed removal and demolition', pos: 'center 45%', label: 'Old garden sheds' },
    crewPhoto: CREW_PHOTOS.byCab,
    teamPhoto: CREW_PHOTOS.walking,
    highlights: ['Demolition + haul away in one visit', 'Stuff inside the shed too', 'Debris cleaned up after'],
    sliderFirst: 'Fence removal',
  },
  'estate-cleanout': {
    headline: 'Estate Cleanout',
    promise: 'Respectful full-home cleanouts for families and executors - keepsakes set aside, usable items donated.',
    itemPhoto: { src: '/junk/estate-cleanout.jpg', alt: 'Household belongings piled outside a property before an estate cleanout', pos: 'center 60%', label: 'Full homes & contents' },
    crewPhoto: CREW_PHOTOS.cabDoor,
    teamPhoto: CREW_PHOTOS.teamOnRoof,
    highlights: ['Patient, careful, judgment-free', 'Documents & valuables set aside', 'Big 29 yd³ truck - fewer trips'],
    sliderFirst: 'Living room',
  },
  'garage-cleanout': {
    headline: 'Garage Cleanout',
    promise: 'Years of boxes, tools, bikes and junk cleared out - so your car fits again.',
    itemPhoto: { src: '/junk/garage-cleanout.jpg', alt: 'Cluttered garage full of boxes, flooring offcuts and tires before a garage cleanout', pos: 'center 55%', label: 'Cluttered garages' },
    crewPhoto: CREW_PHOTOS.loadedTruck,
    teamPhoto: CREW_PHOTOS.byCab,
    highlights: ['Done in a few hours, not weekends', 'Old tires, bikes & tools too', 'Swept clean when we leave'],
    sliderFirst: 'Warehouse',
  },
  'commercial-junk-removal': {
    headline: 'Commercial Junk Removal',
    promise: 'Offices, stores, restaurants and warehouses - cleared on your schedule, including after hours.',
    itemPhoto: { src: '/junk-before-warehouse.jpg', alt: 'Warehouse cluttered with pallets, electronics and boxes before commercial junk removal', pos: 'center 55%', label: 'Offices & warehouses' },
    crewPhoto: CREW_PHOTOS.team,
    teamPhoto: CREW_PHOTOS.truckSide,
    highlights: ['After-hours & weekend pickups', 'Stores, restaurants & rentals', 'Pallets, furniture & e-waste'],
    sliderFirst: 'Warehouse',
  },
}

/** Short photo labels for the generated pages - describe what's in the photo */
const ITEM_LABELS: Record<string, string> = {
  'couch-removal': 'Old couches',
  'dresser-removal': 'Dressers & wardrobes',
  'table-removal': 'Tables & chairs',
  'office-furniture-removal': 'Office furniture',
  'patio-furniture-removal': 'Patio furniture',
  'refrigerator-removal': 'Old fridges',
  'washer-dryer-removal': 'Washers & dryers',
  'stove-removal': 'Stoves & ovens',
  'dishwasher-removal': 'Dishwashers',
  'water-heater-removal': 'Hot water tanks',
  'air-conditioner-removal': 'A/C units',
  'electronics-removal': 'Electronics & e-waste',
  'tv-removal': 'Old TVs',
  'hot-tub-removal': 'Hot tubs',
  'bbq-removal': 'Old BBQs',
  'carpet-removal': 'Carpet & rugs',
  'christmas-tree-removal': 'Christmas trees',
  'exercise-equipment-removal': 'Heavy, bulky items',
  'lawn-mower-removal': 'Garage & yard equipment',
  'yard-waste-removal': 'Yard waste',
  'playset-removal': 'Playsets',
  'cardboard-removal': 'Boxes & cardboard',
  'residential-junk-removal': 'Full truckloads',
  'basement-cleanout': 'Cluttered basements',
  'attic-cleanout': 'Boxes & stored clutter',
  'hoarder-cleanout': 'Packed homes',
  'foreclosure-cleanout': 'Left-behind furniture',
  'storage-unit-cleanout': 'Storage units',
  'apartment-cleanout': 'Apartment move-outs',
  'move-out-cleanout': 'Move-out leftovers',
  'office-cleanout': 'Offices',
  'construction-debris-removal': 'Renovation debris',
  'concrete-removal': 'Concrete & rubble',
  'deck-removal': 'Old decks',
  'fence-removal': 'Old fencing',
  'scrap-metal-removal': 'Scrap metal',
}

/** Items with no photo of their own - the closest real job photo instead */
const STAND_IN_PHOTOS: Record<string, SeoImage> = {
  'exercise-equipment-removal': { src: '/truck-bed-loaded.jpg', alt: 'Stonegate truck loaded with heavy items for removal' },
  'lawn-mower-removal': { src: '/junk/garage-cleanout.jpg', alt: 'Garage full of equipment and junk waiting for removal', pos: 'center 55%' },
  'basement-cleanout': { src: '/burnaby/burnaby-junk-before-cleanout.jpg', alt: 'Cluttered storage space before a cleanout' },
  'attic-cleanout': { src: '/junk/household-junk-removal.jpg', alt: 'Boxes and stored clutter waiting for removal', pos: 'center 55%' },
  'hoarder-cleanout': { src: '/junk/residential-junk-removal.jpg', alt: 'Stonegate truck packed full during a home cleanout', pos: 'center 62%' },
  'foreclosure-cleanout': { src: '/junk-before-livingroom.png', alt: 'Furniture left behind in a living room before a cleanout' },
  'apartment-cleanout': { src: '/junk/move-out-cleanout-2.jpg', alt: 'Stonegate crew loading boxes during an apartment move-out cleanout' },
}

const CATEGORY_HIGHLIGHTS: Record<JunkCategoryId, [string, string, string]> = {
  furniture: ['Any room, any floor', 'We take it apart if it won’t fit', 'Usable pieces donated'],
  appliances: ['Heavy-duty dollies & straps', 'Recycled properly', 'From basements, kitchens & laundry rooms'],
  electronics: ['Taken to approved e-waste recyclers', 'One item or a whole office', 'Carried out from any room'],
  household: ['One item or a full truckload', 'We load it from wherever it sits', 'Donate & recycle first'],
  cleanouts: ['Big 29 yd³ truck - fewer trips', 'We sort, load & sweep up', 'Usable items donated'],
  construction: ['Heavy debris is what we do', 'Loaded by hand - no bin rental', 'Materials recycled where possible'],
}

const CATEGORY_SLIDER: Record<JunkCategoryId, string> = {
  furniture: 'Living room',
  appliances: 'Warehouse',
  electronics: 'Warehouse',
  household: 'Living room',
  cleanouts: 'Living room',
  construction: 'Fence removal',
}

// Rotated across the generated pages so neighbouring pages show different people.
// The cab-door shot is in the hero list twice - the owner wants it used more.
const HERO_ROTATION = [
  CREW_PHOTOS.byCab, CREW_PHOTOS.inCab, CREW_PHOTOS.byTruck, CREW_PHOTOS.besideTruck, CREW_PHOTOS.byCab,
  CREW_PHOTOS.cabDoor, CREW_PHOTOS.inTruck, CREW_PHOTOS.team, CREW_PHOTOS.loadedTruck,
]
const TEAM_ROTATION = [
  CREW_PHOTOS.teamOnRoof, CREW_PHOTOS.ramp, CREW_PHOTOS.walking, CREW_PHOTOS.tailgate,
  CREW_PHOTOS.onRamp, CREW_PHOTOS.homeLoading, CREW_PHOTOS.truckSide,
]
const GENERATED_SLUGS = JUNK_ITEMS.map(i => i.slug).filter(s => !JUNK_ADS[s])

/** Landing page config for any junk item - hand-written for the ad pages, generated for the rest */
export function junkAdFor(item: JunkItem): JunkAd {
  const own = JUNK_ADS[item.slug]
  if (own) return own
  const n = GENERATED_SLUGS.indexOf(item.slug)
  const photo = STAND_IN_PHOTOS[item.slug] ?? itemImages(item)[0] ?? itemImages({ ...item, image: undefined })[0]!
  return {
    headline: item.name,
    promise: item.lead,
    itemPhoto: { ...photo, label: ITEM_LABELS[item.slug] ?? item.name },
    crewPhoto: HERO_ROTATION[n % HERO_ROTATION.length],
    teamPhoto: TEAM_ROTATION[n % TEAM_ROTATION.length],
    highlights: CATEGORY_HIGHLIGHTS[item.category],
    sliderFirst: CATEGORY_SLIDER[item.category],
  }
}
