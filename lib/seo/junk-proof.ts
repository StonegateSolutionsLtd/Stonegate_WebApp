import type { SliderPair } from '@/components/landing/BeforeAfterSlider'

/** Social proof shared by the /junk-removal landing page and the per-service ad landing pages */

export const GOOGLE_REVIEWS_URL = 'https://maps.app.goo.gl/ooQYs564eGP7JZbC6'

export const featuredReview = {
  name: 'Ksusha Martynova',
  text: 'They were courteous, worked fast, and had everything loaded up in no time. The price was better than I expected.',
}

export const reviews = [
  { name: 'Aizhan Tabyldiyeva', text: 'Excellent junk removal service! The team was professional, punctual, and worked quickly. Their pricing was very fair and offered great value for the quality of service. They cleared everything out efficiently. Highly recommend!!' },
  { name: 'Albert Go', text: 'I had a great experience with Stonegate Moving Solutions for junk removal. They responded quickly, arrived on time, and cleared everything out much faster than I expected. The crew was friendly and professional.' },
  { name: 'Aryan Kapoor', text: 'Really happy with the service. The guys were on time, worked quickly, and took good care of my stuff. Would definitely use them again!' },
]

// The before/after shots weren't taken from the exact same spot - the transforms line them up for the drag slider
export const beforeAfterPairs: SliderPair[] = [
  { label: 'Warehouse', before: '/junk-before-warehouse.jpg', after: '/junk-after-warehouse.jpg', afterAlign: { transform: 'scale(1.32)', transformOrigin: '30% 70%' } },
  // The after shot faces back the other way along the fence - mirrored so the fence sits on the same side
  { label: 'Fence removal', before: '/junk-before-fence.jpg', after: '/junk-after-fence-v2.jpg', afterAlign: { transform: 'scaleX(-1)', objectPosition: 'center 30%' } },
  { label: 'Living room', before: '/junk-before-livingroom.png', after: '/junk-after-livingroom.png', beforeAlign: { transform: 'scale(1.97)', transformOrigin: '39% 53%' } },
]
