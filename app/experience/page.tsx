import type { Metadata } from 'next';
import ExperienceClient from './ExperienceClient';

export const metadata: Metadata = {
  title: 'The Experience | Purgatory Townhouse Colorado',
  description: 'Everything you need for the perfect Colorado mountain getaway — skiing at Purgatory Resort, alpine hiking, mountain lakes, and the historic charm of Durango and Silverton.',
  keywords: [
    'Purgatory Colorado experience',
    'Colorado mountain vacation activities',
    'Purgatory Resort skiing and hiking',
    'San Juan Mountains things to do',
    'Colorado mountain getaway',
    'Durango Colorado activities',
    'Purgatory Townhouse experience',
    'mountain vacation Colorado',
  ],
};

export default function ExperiencePage() {
  return <ExperienceClient />;
}
