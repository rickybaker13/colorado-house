// Property facts served to AI agents. Everything here is taken from what the
// website already publishes (property page, gallery, resort page). Anything the
// site does not state is null with a note, so agents never invent it.
//
// OWNER TODO: fill in the fields marked null (cancellation policy, house rules)
// and they will flow to agents automatically.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://skipurgatoryhouse.com').replace(/\/$/, '');

export const PROPERTY = {
  name: 'Purgatory Townhouse',
  website: SITE_URL,
  booking_page: `${SITE_URL}/booking`,
  summary:
    'Four-bedroom mountain townhouse at the base of Purgatory Resort in the San Juan Mountains near Durango, Colorado. Sleeps 10, with vaulted ceilings, a floor-to-ceiling stone fireplace, a bunk room with an Xbox, and a fully stocked kitchen.',
  location: {
    area: 'Base of Purgatory Resort, near Durango, Colorado (San Juan Mountains)',
    ski_access: 'Ski-in/ski-out, on the free shuttle route',
    exact_address: 'Shared with the guest after the booking is confirmed.',
    nearby: [
      'Purgatory Resort: 12 lifts, 105 trails; summer chairlift rides, mountain bike park, and Inferno Mountain Coaster',
      'Purgatory Trail (#511) trailhead a short walk down the street',
      'Durango, Silverton, the Needle Mountains, and alpine lakes (Ice Lake, Bullion King Lake) for day trips',
    ],
  },
  capacity: { max_guests: 10, bedrooms: 4, bathrooms: 3.5 },
  rooms: [
    { name: 'Great room', detail: 'Vaulted ceilings, floor-to-ceiling stone fireplace, open to kitchen with mountain views' },
    { name: 'Master suite', detail: 'King bed, mountain-modern decor' },
    { name: 'Guest bedrooms', detail: 'One with a queen bed; one with green bedding and mountain art' },
    { name: 'Bunk room', detail: 'Two bunks, sectional sofa, TV, and Xbox' },
    { name: 'Kitchen', detail: 'Quartz counters, knotty alder cabinets, island seating, fully stocked' },
  ],
  amenities: {
    views: ['Mountain views', 'Resort views'],
    kitchen: ['Full kitchen', 'Refrigerator', 'Microwave', 'Dishwasher', 'Stove', 'Oven', 'Cooking basics', 'Dishes and silverware'],
    laundry_and_linens: ['Free in-unit washer and dryer', 'Towels and bed sheets', 'Egyptian cotton linens', 'Extra pillows and blankets', 'Room-darkening shades', 'Iron', 'Hangers'],
    bathroom: ['Shampoo', 'Conditioner', 'Body soap', 'Hair dryer', 'Glass-walled walk-in shower'],
    entertainment: ['TV', 'Xbox', 'Ping pong table', 'Pool table', 'Board games', 'Exercise equipment'],
    family: ["Pack 'n play / travel crib", "Children's dinnerware"],
    heating: ['Gas fireplace', 'Radiant heating', 'Portable fans'],
    work: ['WiFi', 'Dedicated workspace'],
    outdoor: ['Private patio or balcony', 'Outdoor furniture', 'Hammock', 'Charcoal BBQ grill', 'Outdoor dining area'],
    shared_facilities: ['Hot tub (shared)', 'Gym (shared)', 'Resort access'],
    safety: ['Smoke alarm', 'Carbon monoxide alarm', 'Fire extinguisher'],
    not_included: ['Air conditioning'],
  },
  policies: {
    check_in: '4:00 PM, self check-in with smart lock keypad',
    check_out: '10:00 AM',
    early_luggage_dropoff: 'Available',
    parking: 'Free, on premises',
    pets: 'Allowed (limit and fee in get_quote)',
    long_term_stays: 'Allowed; stays over 90 nights are arranged with the owner directly',
    booking_process:
      'Every request is reviewed by the owner before it is confirmed. Payment is a 50% deposit, with the balance due before arrival.',
    cancellation_policy: null as string | null,
    house_rules: null as string | null,
    unpublished_note:
      'The owner has not yet published a cancellation policy or full house rules. Do not assume one; tell the traveler the owner will provide it, or include the question in the booking request message.',
  },
};

export type PhotoCategory = 'exterior' | 'living' | 'kitchen_dining' | 'bedrooms' | 'bathrooms' | 'details' | 'area';

// Descriptions match the gallery's own captions (file names on disk do not
// always match their content, so captions are the source of truth).
const PHOTOS: { file: string; category: PhotoCategory; description: string }[] = [
  { file: 'kitchen-1.jpg', category: 'exterior', description: 'Townhouse exterior: modern mountain architecture with deck and garage' },
  { file: 'detail-3.jpg', category: 'exterior', description: 'Front entrance with smart lock' },
  { file: 'kitchen-3.jpg', category: 'exterior', description: 'Entry hallway with runner rug' },
  { file: 'views-1.jpg', category: 'living', description: 'Great room: vaulted ceilings, fireplace, open kitchen' },
  { file: 'views-2.jpg', category: 'living', description: 'Living room from the loft showing the full open layout' },
  { file: 'bedroom-guest-2.jpg', category: 'living', description: 'Floor-to-ceiling stone fireplace seen from the sofa' },
  { file: 'detail-1.jpg', category: 'living', description: 'Leather sofa and mountain art' },
  { file: 'dining-1.jpg', category: 'kitchen_dining', description: 'Dining table with tree-ring wall art' },
  { file: 'kitchen-2.jpg', category: 'kitchen_dining', description: 'Kitchen island with pendant lights and knotty alder cabinets' },
  { file: 'exterior-3.jpg', category: 'bedrooms', description: 'Master bedroom: king bed with Pendleton blanket' },
  { file: 'exterior-2.jpg', category: 'bedrooms', description: 'Guest bedroom: green bedding with mountain art' },
  { file: 'living-room-1.jpg', category: 'bedrooms', description: 'Guest bedroom: queen bed with orange duvet' },
  { file: 'living-room-2.jpg', category: 'bedrooms', description: 'Bunk room: two bunks, sofa, TV, and Xbox' },
  { file: 'exterior-1.jpg', category: 'bedrooms', description: 'Upstairs sitting nook with chair and deer art' },
  { file: 'bathroom-1.jpg', category: 'bathrooms', description: 'Glass-walled walk-in shower' },
  { file: 'bathroom-2.jpg', category: 'bathrooms', description: 'Bathroom with marble vanity' },
  { file: 'bedroom-master-1.jpg', category: 'details', description: 'Entry foyer with wood details' },
  { file: 'detail-2.jpg', category: 'details', description: 'In-unit laundry area' },
  { file: 'laundry.jpg', category: 'details', description: 'LG washer and dryer' },
  { file: 'bedroom-guest-1.jpg', category: 'details', description: 'Upper hallway looking toward the bedrooms' },
  { file: 'hero-mountain.jpg', category: 'area', description: 'Snow-capped San Juan peaks with pine forest' },
  { file: 'engineer-mountain.jpg', category: 'area', description: 'Engineer Mountain with pine forest' },
  { file: 'bullion-king-lake.jpg', category: 'area', description: 'Bullion King Lake: peaks and reflection' },
  { file: 'ice-lake-panoramic.jpg', category: 'area', description: 'Ice Lake panorama: turquoise water and peaks' },
  { file: 'alpenglow-sunset.jpg', category: 'area', description: 'Alpenglow sunset on the San Juan Mountains' },
  { file: 'wildflowers-pass.jpg', category: 'area', description: 'Wildflower meadow at an alpine pass' },
];

export function getPhotos(category: PhotoCategory | 'all') {
  return PHOTOS.filter((p) => category === 'all' || p.category === category).map((p) => ({
    url: `${SITE_URL}/images/${p.file}`,
    category: p.category,
    description: p.description,
    shows_the_property: p.category !== 'area',
  }));
}
