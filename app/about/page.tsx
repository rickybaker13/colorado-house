import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About | Purgatory Townhouse Colorado',
  description: 'Learn about the Purgatory Townhouse — a privately owned luxury mountain retreat near Durango, Colorado. Contact us with questions or to book your stay.',
  keywords: [
    'about Purgatory Townhouse',
    'Colorado vacation rental contact',
    'Purgatory Resort lodging owner',
    'Durango mountain rental info',
    'San Juan Mountains vacation contact',
    'private mountain rental Colorado',
  ],
};

export default function AboutPage() {
  return <AboutClient />;
}
