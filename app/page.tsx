import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Purgatory Townhouse | Luxury Mountain Rental near Durango, CO',
  description: 'Stay at our 4-bedroom luxury townhouse at Purgatory Resort in the San Juan Mountains. Ski-in/ski-out access, mountain views, sleeps 10. Book direct.',
  keywords: [
    'Purgatory vacation rental',
    'Durango Colorado cabin rental',
    'San Juan Mountains vacation home',
    'ski rental Purgatory Resort',
    'Colorado mountain house rental',
    'luxury vacation rental Durango',
    'Purgatory townhouse',
    'ski-in ski-out Colorado',
  ],
};

export default function HomePage() {
  return <HomeClient />;
}
