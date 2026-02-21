import type { Metadata } from 'next';
import PurgatoryResortClient from './PurgatoryResortClient';

export const metadata: Metadata = {
  title: 'Purgatory Resort Colorado | Ski & Summer Activities',
  description: 'Purgatory Resort offers world-class skiing with 1,600 acres, 105 trails, and 260 inches of annual snowfall. Summer brings mountain biking, the Inferno Coaster, and alpine slides.',
  keywords: [
    'Purgatory Resort Colorado',
    'Purgatory ski resort',
    'skiing near Durango Colorado',
    'Purgatory Resort activities',
    'Colorado ski resort',
    'Purgatory Mountain Coaster',
    'ski resort San Juan Mountains',
    'Purgatory Resort summer activities',
  ],
};

export default function PurgatoryResortPage() {
  return <PurgatoryResortClient />;
}
