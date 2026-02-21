import type { Metadata } from 'next';
import LakesWaterClient from './LakesWaterClient';

export const metadata: Metadata = {
  title: 'Lakes & Water | San Juan Mountains Colorado',
  description: 'Discover the rivers, reservoirs, and alpine lakes of the San Juan Mountains near Purgatory Resort — from fly fishing the Animas River to paddling Vallecito Reservoir.',
  keywords: [
    'lakes near Purgatory Resort Colorado',
    'San Juan Mountains fishing',
    'Animas River fly fishing Durango',
    'Vallecito Reservoir Colorado',
    'mountain lakes southwestern Colorado',
    'water activities near Purgatory',
    'Colorado alpine lakes fishing',
    'San Juan Mountains rivers',
  ],
};

export default function LakesWaterPage() {
  return <LakesWaterClient />;
}
