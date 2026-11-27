import { PROPERTY, SITE_URL } from '@/lib/agent/property';

// schema.org markup so search engines and AI agents can read what this site is:
// a vacation rental with direct booking and an MCP booking connection.
// The street address is deliberately left out; guests get it once a booking is confirmed.
export default function StructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'VacationRental',
        '@id': `${SITE_URL}/#rental`,
        name: PROPERTY.name,
        url: SITE_URL,
        description: PROPERTY.summary,
        image: [
          `${SITE_URL}/images/hero-front-page.jpg`,
          `${SITE_URL}/images/hero-mountain.jpg`,
        ],
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Durango',
          addressRegion: 'CO',
          postalCode: '81301',
          addressCountry: 'US',
        },
        geo: { '@type': 'GeoCoordinates', latitude: 37.62, longitude: -107.81 },
        containsPlace: {
          '@type': 'Accommodation',
          additionalType: 'EntirePlace',
          numberOfBedrooms: PROPERTY.capacity.bedrooms,
          numberOfBathroomsTotal: PROPERTY.capacity.bathrooms,
          floorSize: { '@type': 'QuantitativeValue', value: PROPERTY.capacity.square_feet, unitCode: 'FTK' },
          occupancy: { '@type': 'QuantitativeValue', maxValue: PROPERTY.capacity.max_guests },
        },
        amenityFeature: ['Private hot tub', 'Gas fireplace', 'Garage with boot warmers', 'Free ski shuttle', 'Game room', 'Pet friendly'].map(
          (name) => ({ '@type': 'LocationFeatureSpecification', name, value: true }),
        ),
        potentialAction: {
          '@type': 'ReserveAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/booking` },
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: PROPERTY.name,
        about: { '@id': `${SITE_URL}/#rental` },
        subjectOf: {
          '@type': 'WebAPI',
          name: 'Purgatory Townhouse booking (MCP server)',
          description:
            'Model Context Protocol server for AI agents: check availability, get quotes, see photos, and send booking requests. The owners approve every request.',
          url: `${SITE_URL}/api/mcp`,
          documentation: `${SITE_URL}/llms.txt`,
        },
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
