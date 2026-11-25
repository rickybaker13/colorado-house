// Property facts served to AI agents. Taken from what the website publishes
// (property page, gallery, resort page) and from the owners' Airbnb listing
// (airbnb.com/rooms/1205985906587842742), checked Nov 25, 2026: house rules,
// cancellation policy, amenities, and room layout. Keep the two in sync.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://skipurgatoryhouse.com').replace(/\/$/, '');

export const PROPERTY = {
  name: 'Purgatory Townhouse',
  website: SITE_URL,
  booking_page: `${SITE_URL}/booking`,
  summary:
    'Four-bedroom, 3.5-bath, 2,790 sq ft alpine-modern townhouse in Tacoma Village, directly across the highway from the Purgatory Resort entrance near Durango, Colorado. Sleeps 10. Private hot tub on the deck facing Engineer Mountain, vaulted great room with a gas fireplace, game room with Xbox and pool/ping pong/air hockey table, and a garage with ski racks and boot warmers. Airbnb Superhost, Guest Favorite, rated 4.97 from 32 reviews.',
  location: {
    area: 'Tacoma Village, across the highway from the Purgatory Resort entrance, about 25 minutes north of Durango, Colorado (San Juan Mountains)',
    elevation_ft: 8832,
    ski_access:
      'On the free shuttle line: a complimentary, on-demand, door-to-door shuttle to the base area (summoned through the Purgatory app). Many guests also walk to the lift.',
    exact_address: 'Shared with the guest after the booking is confirmed.',
    nearby: [
      'Purgatory Resort: 12 lifts, 105 trails; summer chairlift rides, mountain bike park, and Inferno Mountain Coaster',
      'Purgatory Trail (#511) trailhead a short walk down the street',
      'Twilight Lake and its hiking trails, a short walk away',
      'Downtown Durango (restaurants, shops, breweries) and Durango airport, about 25 minutes by car',
      'Silverton, the Needle Mountains, and alpine lakes (Ice Lake, Bullion King Lake) for day trips',
    ],
  },
  capacity: {
    max_guests: 10,
    extra_guests: 'More than 10 only with the owner\'s approval and for a fee; ask in the booking request',
    bedrooms: 4,
    beds: 7,
    bathrooms: 3.5,
    square_feet: 2790,
    floors: 3,
  },
  rooms: [
    { name: 'First floor', detail: 'Bunk room (two bunk beds, sleeps 4) with sofa, smart TV and Xbox, en-suite bathroom, closet of board games, and a pool/ping pong/air hockey game table. Garage with ski and snowboard racks and boot warmers.' },
    { name: 'Second floor (main level)', detail: 'Open great room and kitchen with vaulted ceilings, gas fireplace, and large windows; deck with private hot tub, grill, and views of Engineer Mountain and the ski slopes; powder room; laundry room.' },
    { name: 'Master suite (second floor)', detail: 'King bed, walk-in closet, five-piece bath with glass-walled walk-in shower' },
    { name: 'Third floor', detail: 'Two bedrooms with a queen bed each, a full bathroom, and a loft with a trundle bed and office area overlooking the great room' },
    { name: 'Kitchen', detail: 'Fully stocked gourmet kitchen: quartz counters, knotty alder cabinets, island bar seating, stocked spice cabinet' },
  ],
  amenities: {
    views: ['Mountain views', 'Resort views'],
    kitchen: ['Full kitchen', 'Refrigerator', 'Freezer', 'Microwave', 'Dishwasher', 'Stove', 'Oven', 'Toaster', 'Blender', 'Hot water kettle', 'Drip coffee maker', 'Coffee', 'Wine glasses', 'Baking sheet', 'Cooking basics', 'Dishes and silverware', 'Dining table', 'Barbecue utensils'],
    laundry_and_linens: ['Free in-unit washer and dryer', 'Towels and bed sheets', 'Egyptian cotton linens', 'Extra pillows and blankets', 'Clothing storage', 'Hangers'],
    bathroom: ['Shampoo', 'Conditioner', 'Body soap', 'Shower gel', 'Hair dryer', 'Cleaning products', 'Hot water', 'Glass-walled walk-in shower'],
    entertainment: ['Smart TV', 'Xbox', 'Pool / ping pong / air hockey game table', 'Board games', 'Books', 'Yoga mat'],
    family: ["Pack 'n play / travel crib", "Children's dinnerware", 'Board games'],
    heating: ['Gas fireplace', 'Radiant heating', 'Portable fans'],
    work: ['WiFi', 'Dedicated workspace (loft office area)'],
    outdoor: ['Private hot tub on the deck', 'Private balcony deck with mountain views', 'Gas grill', 'Outdoor furniture', 'Hammock'],
    ski_and_gear: ['Garage available to guests', 'Ski and snowboard racks', 'Boot warmers'],
    location_features: ['Lake access (Twilight Lake)', 'Free on-demand ski shuttle', 'Private entrance'],
    optional_resort_access:
      'Heated pool, hot tub, and fitness center at the main Purgatory Lodge, available for a 4% amenity fee',
    safety: ['Smoke alarm', 'Carbon monoxide alarm', 'Fire extinguisher'],
    security_camera: 'One outdoor security camera, on the exterior above the garage door, watching who comes and goes. No cameras inside.',
    not_included: ['Air conditioning (common in the mountains; nights are cool)'],
  },
  policies: {
    check_in: 'After 4:00 PM, self check-in with a smart lock keypad and a unique door code',
    check_out: 'Before 10:00 AM',
    early_luggage_dropoff: 'Available',
    parking: 'Free, on premises, including the garage. The HOA does not allow parking on the streets.',
    pets:
      'Up to 2 well-behaved, house-trained pets, $200 pet fee per stay (included in get_quote). All pets must be listed on the reservation; an undisclosed pet is charged $150 per night. No pets on furniture or beds. Extra cleaning or damage from pets is charged. Assistance animals are always allowed.',
    long_term_stays: 'Allowed; stays over 90 nights are arranged with the owner directly',
    booking_process:
      'Every request is reviewed by the owner before it is confirmed. Payment is a 50% deposit, with the balance due before arrival.',
    cancellation_policy:
      'Full refund if cancelled at least 30 days before check-in (by 4:00 PM, Mountain Time). 50% refund of the nightly rate if cancelled at least 7 days before check-in. No refund if cancelled less than 7 days before check-in.',
    house_rules: [
      'Up to 10 overnight guests (more only with the owner\'s approval and for a fee)',
      'No smoking or vaping anywhere in the unit, including e-cigarettes. Evidence of smoking is charged a $500 fee plus any cleaning needed.',
      'No parties or events',
      'Quiet hours 10:00 PM to 7:00 AM',
      'No commercial photography or filming',
      'Hot tub: shower before entering; at most 5 people at a time (it overflows and has caused water damage); no soaps, bubbles, or dyes in the water; no food or glass in or around the tub; anyone under 18 must be supervised by an adult; keep the cover on when not in use. Guests use the hot tub at their own risk and pay for extra cleaning caused by misuse.',
      'Before checkout: start the dishwasher, close the hot tub cover, empty the refrigerator of food, and take out all garbage, including from the bathrooms',
      'Lock up at checkout by pressing the lock (#) button at the bottom right of the front door keypad',
      'Tell the owner about any damage during the stay. The cleaner takes inventory between stays, and missing or damaged items are charged.',
      'HOA rules: no parking on the streets, and no garbage in the construction dumpster',
    ],
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
