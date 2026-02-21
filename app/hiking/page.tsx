import type { Metadata } from 'next';
import HikingClient from './HikingClient';

export const metadata: Metadata = {
  title: 'Hiking Near Purgatory | San Juan Mountains Trails',
  description: 'Discover world-class hiking trails near Purgatory Resort. The Weminuche Wilderness, Colorado Trail, and hundreds of miles of alpine trails start minutes from our door.',
  keywords: [
    'hiking near Purgatory Resort',
    'San Juan Mountains hiking trails',
    'Weminuche Wilderness hiking',
    'Colorado Trail Durango',
    'alpine hiking Colorado',
    'hiking Durango Colorado',
    'fourteener hiking San Juan Mountains',
    'mountain trails near Purgatory',
  ],
};

export default function HikingPage() {
  return <HikingClient />;
}
