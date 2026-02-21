import type { Metadata } from 'next';
import AlpineLakesClient from './AlpineLakesClient';

export const metadata: Metadata = {
  title: 'Alpine Lakes Near Purgatory | San Juan Mountains Colorado',
  description: 'Explore stunning alpine lakes near Purgatory Resort — Ice Lakes Basin, Bullion King Lake, and more crystal-clear mountain lakes in the San Juan Mountains of Colorado.',
  keywords: [
    'alpine lakes San Juan Mountains',
    'Ice Lakes Basin Colorado',
    'Bullion King Lake hiking',
    'mountain lakes near Durango',
    'alpine lake hiking Colorado',
    'San Juan Mountains lakes',
    'high altitude lakes Colorado',
    'lakes near Purgatory Resort',
  ],
};

export default function AlpineLakesPage() {
  return <AlpineLakesClient />;
}
