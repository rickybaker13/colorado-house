import type { Metadata } from 'next';
import PracticalInfoClient from './PracticalInfoClient';

export const metadata: Metadata = {
  title: 'Practical Info | Purgatory Townhouse Colorado',
  description: 'Everything you need to know before your stay — check-in times, house rules, parking, amenities, nearby grocery stores, and tips for visiting Purgatory Resort.',
  keywords: [
    'Purgatory Townhouse check-in',
    'Colorado vacation rental practical info',
    'Purgatory Resort guest info',
    'Durango Colorado rental house rules',
    'what to bring Purgatory Colorado',
    'Purgatory vacation rental amenities',
    'Colorado mountain rental FAQ',
    'Purgatory Townhouse guest guide',
  ],
};

export default function PracticalInfoPage() {
  return <PracticalInfoClient />;
}
