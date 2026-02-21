import type { Metadata } from 'next';
import DurangoClient from './DurangoClient';

export const metadata: Metadata = {
  title: 'Durango Colorado | Things to Do Near Purgatory Resort',
  description: 'Explore Durango, Colorado — just 25 miles from Purgatory Resort. Ride the historic Narrow Gauge Railroad, raft the Animas River, visit Mesa Verde, and more.',
  keywords: [
    'Durango Colorado things to do',
    'Durango near Purgatory Resort',
    'Durango Silverton Narrow Gauge Railroad',
    'Mesa Verde National Park',
    'Animas River rafting Durango',
    'Durango Colorado travel guide',
    'things to do near Purgatory ski resort',
    'Durango Colorado vacation',
  ],
};

export default function DurangoPage() {
  return <DurangoClient />;
}
