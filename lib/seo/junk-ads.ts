import type { SeoImage } from './site'

/**
 * Google Ads landing pages. These /junk-removal/[slug] pages get the conversion-focused
 * layout (item photo + real crew photo in the hero, CTAs above the fold) instead of the
 * standard SEO item template.
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
