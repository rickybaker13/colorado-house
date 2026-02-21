import type { Metadata } from 'next';
import PropertyClient from './PropertyClient';

export const metadata: Metadata = {
  title: 'The Townhouse | 4BR Mountain Home at Purgatory Resort',
  description: 'Spacious 4-bedroom, 3.5-bath luxury townhouse at Purgatory Resort. Vaulted ceilings, stone fireplace, fully equipped kitchen, sleeps 10. Perfect for families and groups.',
  keywords: [
    'Purgatory Resort rental property',
    '4 bedroom vacation rental Colorado',
    'luxury townhouse Purgatory',
    'San Juan Mountains rental home',
    'ski house Durango Colorado',
    'mountain vacation rental sleeps 10',
    'Purgatory ski rental',
    'Colorado ski house',
  ],
};

export default function PropertyPage() {
  return <PropertyClient />;
}
