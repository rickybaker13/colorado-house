import type { Metadata } from 'next';
import SilvertonClient from './SilvertonClient';

export const metadata: Metadata = {
  title: 'Silverton Colorado | Historic Mining Town in the San Juans',
  description: 'Visit Silverton, Colorado — a National Historic Landmark at 9,318 feet in the San Juan Mountains. Ride the historic Durango & Silverton Narrow Gauge Railroad and explore old west history.',
  keywords: [
    'Silverton Colorado',
    'Silverton historic town',
    'Durango Silverton Railroad',
    'San Juan Mountains mining town',
    'things to do Silverton Colorado',
    'Silverton Colorado elevation',
    'historic Silverton Colorado',
    'Silverton near Purgatory Resort',
  ],
};

export default function SilvertonPage() {
  return <SilvertonClient />;
}
