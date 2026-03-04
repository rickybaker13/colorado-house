// ============================================================
// Purgatory Townhouse — Marketing Agent Configuration
// ============================================================
// This file contains all brand context, property details, and
// content strategy that the AI agents use to generate posts.
// ============================================================

export const PROPERTY = {
  name: "Purgatory Townhouse",
  tagline: "Luxury mountain retreat at Purgatory Resort",
  location: "108 Travertine Trl, Durango, CO 81301",
  elevation: "8,793 feet",
  bedrooms: 4,
  bathrooms: 3.5,
  maxGuests: 10,
  website: "https://colorado-house.vercel.app",
  bookingUrl: "https://colorado-house.vercel.app/booking",

  highlights: [
    "Steps from Purgatory Resort ski lifts",
    "4 bedrooms, sleeps 10 guests",
    "3.5 bathrooms",
    "8,793 feet elevation",
    "Full kitchen, fireplace, mountain views",
    "Pet-friendly",
    "Kids 12 and under ski free at Purgatory",
    "Book direct and save vs Airbnb fees",
  ],

  nearbyAttractions: [
    "Purgatory Resort (skiing, alpine coaster, mountain biking)",
    "Durango & Silverton Narrow Gauge Railroad",
    "Mesa Verde National Park",
    "Ice Lakes Basin trail",
    "San Juan Skyway scenic drive",
    "Weminuche Wilderness",
    "Historic downtown Durango",
    "Silverton ghost town",
    "Alpine lakes (Molas, Columbine, Island Lake)",
    "Engineer Mountain",
  ],

  seasons: {
    winter: {
      months: "November–March",
      selling_points: [
        "Ski-in proximity to Purgatory Resort",
        "Kids 12 and under ski free",
        "Snowshoeing, cross-country skiing",
        "Cozy fireplace after a day on the slopes",
      ],
    },
    summer: {
      months: "June–September",
      selling_points: [
        "Escape the Texas/Arizona/New Mexico heat",
        "70°F while it's 105°F in Dallas",
        "World-class hiking (Ice Lakes, Columbine Lake)",
        "Wildflower season in July",
        "Mountain biking, rafting, fishing",
      ],
    },
    fall: {
      months: "September–October",
      selling_points: [
        "Spectacular fall colors in the San Juans",
        "Aspens turn gold at elevation",
        "Fewer crowds, shoulder season pricing",
        "Perfect hiking weather",
      ],
    },
    spring: {
      months: "April–May",
      selling_points: [
        "Late-season skiing (Purgatory often open through April)",
        "Shoulder season rates",
        "Waterfalls at peak flow from snowmelt",
        "Early wildflowers at lower elevations",
      ],
    },
  },
} as const;

export const BRAND_VOICE = {
  tone: [
    "Warm and inviting, like a knowledgeable friend who lives in the mountains",
    "Evocative and sensory — paint pictures with words",
    "Never salesy or pushy — be genuinely helpful",
    "Confident but not boastful",
    "Use specific details (elevation, trail names, temperatures) for authenticity",
  ],

  doNot: [
    "Don't use generic travel clichés ('hidden gem', 'best-kept secret')",
    "Don't be overly promotional — content should be useful first",
    "Don't use excessive emojis (1-3 max per post)",
    "Don't mention competitor properties",
    "Don't make claims about pricing without current rates",
    "Don't use AI-sounding phrases ('nestled in', 'tapestry of', 'dive into')",
  ],

  callToAction: [
    "Link in bio for availability",
    "Book direct at colorado-house.vercel.app and save vs Airbnb",
    "DM us for current rates",
    "See the full trail guide on our site (link in bio)",
  ],
} as const;

export const TARGET_MARKETS = {
  primary: ["Texas (Dallas, Austin, Houston, San Antonio)"],
  secondary: ["New Mexico (Albuquerque, Santa Fe)", "Arizona (Phoenix, Tucson)"],
  tertiary: ["Denver metro", "Broader US"],
  demographics: "Adults 28-60, families with kids, couples, friend groups, corporate retreats",
} as const;

export const CONTENT_THEMES = {
  // Rotate through these themes for variety
  categories: [
    "property_showcase",    // Interior/exterior photos with captions
    "mountain_views",       // Landscape and nature shots
    "trail_guide",          // Hiking and outdoor activity tips
    "local_attraction",     // Durango, Silverton, railroad, Mesa Verde
    "seasonal_escape",      // "Escape the heat" / "Ski season is here"
    "guest_experience",     // Reviews, testimonials, guest moments
    "behind_the_scenes",    // Property prep, local life, weather updates
    "educational",          // Packing tips, driving routes, what to expect
  ],
} as const;

export const HASHTAGS = {
  // Platform-specific hashtag strategies
  instagram: {
    always: ["#PurgatoryTownhouse", "#Durango", "#PurgatoryResort"],
    broad: [
      "#ColoradoVacation", "#MountainGetaway", "#SkiTrip",
      "#FamilyVacation", "#MountainLife", "#CabinLife",
    ],
    specific: [
      "#SanJuanMountains", "#DurangoColorado", "#SouthwestColorado",
      "#WeminucheWilderness", "#IceLakesBasin", "#ColoradoHiking",
    ],
    niche: [
      "#EscapeTheHeat", "#TexasToColorado", "#MountainCabin",
      "#BookDirect", "#VacationRental", "#SKiColorado",
    ],
    // Use 15-20 per post, mix from each category
    perPost: 18,
  },
  pinterest: {
    // Pinterest uses keyword-rich descriptions, not # hashtags
    keywords: [
      "Durango Colorado vacation",
      "mountain cabin rental",
      "Colorado ski trip",
      "escape the heat",
      "family mountain vacation",
      "San Juan Mountains",
      "Purgatory Resort",
      "things to do in Durango",
      "Colorado hiking trails",
      "mountain getaway from Texas",
    ],
  },
  x: {
    // X uses fewer hashtags (3-5 max)
    always: ["#Durango", "#Colorado"],
    rotating: [
      "#PurgatoryResort", "#SanJuanMountains", "#MountainGetaway",
      "#SkiColorado", "#ColoradoTravel", "#EscapeTheHeat",
    ],
    perPost: 4,
  },
  facebook: {
    // Facebook uses minimal hashtags (2-3) — engagement driven by content
    always: ["#PurgatoryTownhouse"],
    optional: ["#DurangoColorado", "#MountainVacation", "#ColoradoTravel"],
    perPost: 3,
  },
} as const;

export const PHOTO_LIBRARY = {
  // Categories mapping to actual files in public/images/
  // The AI agent selects appropriate images based on post theme
  exterior: [
    "exterior-1.jpg",
    "exterior-2.jpg",
    "exterior-3.jpg",
    "hero-front-page.jpg",
    "views-1.jpg",
    "views-2.jpg",
  ],
  interior: [
    "living-room-1.jpg",
    "living-room-2.jpg",
    "kitchen-1.jpg",
    "kitchen-2.jpg",
    "kitchen-3.jpg",
    "bedroom-master-1.jpg",
    "bedroom-guest-1.jpg",
    "bedroom-guest-2.jpg",
    "bathroom-1.jpg",
    "bathroom-2.jpg",
    "dining-1.jpg",
    "laundry.jpg",
    "detail-1.jpg",
    "detail-2.jpg",
    "detail-3.jpg",
    "file_35---8442826e-0583-4f7c-8519-ddf80feb638a.jpg",
    "file_36---0040c3ea-93a5-4919-8017-c6349fa8f70d.jpg",
    "file_37---99ef673a-f1cd-450c-8e00-2fac70252c2c.jpg",
    "file_38---159a7a4b-5b0e-4282-8223-ef152a20542c.jpg",
    "file_39---83886c87-e830-474b-bcc7-f810d9e19bf2.jpg",
    "file_40---2402f62f-b03c-4a90-892d-2689435e9ac4.jpg",
    "file_41---abcefd98-23fb-43a9-91a3-e43ed9b30e63.jpg",
    "file_42---4c9e886f-4807-486a-acf3-5e0d1c74b5da.jpg",
    "file_43---5eae66d5-bfbe-41da-a496-c720416e2eed.jpg",
  ],
  mountains: [
    "alpenglow-sunset.jpg",
    "hero-mountain.jpg",
    "engineer-mountain.jpg",
    "alpine-valley.jpg",
    "wildflower-meadow-peaks.jpg",
    "wildflowers-pass.jpg",
    "sunflowers-mountain-valley.jpg",
  ],
  lakes: [
    "ice-lake-basin-wide.jpg",
    "ice-lake-closeup.jpg",
    "ice-lake-panoramic.jpg",
    "ice-lake-shore.jpg",
    "upper-ice-lake.jpg",
    "island-lake-panoramic.jpg",
    "columbine-lake.jpg",
    "bullion-king-lake.jpg",
    "bullion-king-lake-2.jpg",
    "bullion-king-lake-3.jpg",
    "bullion-king-lake-4.jpg",
    "bullion-king-lake-5.jpg",
    "bullion-king-lake-6.jpg",
    "bullion-king-lake-7.jpg",
    "bullion-king-lake-8.jpg",
    "bullion-king-lake-9.jpg",
    "kayak-mountain-lake.jpg",
    "lake-kayak.jpg",
  ],
  trails: [
    "ice-lakes-trail.jpg",
    "ice-lakes-trail-alpine.jpg",
    "waterfall.jpg",
    "waterfall-gorge.jpg",
  ],
  durango: [
    "durango-downtown-main.jpg",
    "durango-downtown-winter.jpg",
    "mesa-verde-cliff-dwelling.jpg",
    "mesa-verde-cliff-palace.jpg",
  ],
} as const;

// Determine current season based on date
export function getCurrentSeason(): keyof typeof PROPERTY.seasons {
  const month = new Date().getMonth() + 1;
  if (month >= 11 || month <= 3) return "winter";
  if (month >= 6 && month <= 9) return "summer";
  if (month >= 9 && month <= 10) return "fall";
  return "spring";
}

// Get current month name
export function getCurrentMonth(): string {
  return new Date().toLocaleString("en-US", { month: "long" });
}
