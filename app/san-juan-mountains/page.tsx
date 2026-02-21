import type { Metadata } from 'next';
import SanJuanMountainsClient from './SanJuanMountainsClient';

export const metadata: Metadata = {
  title: 'San Juan Mountains Colorado | Alpine Wilderness Guide',
  description: "Discover the San Juan Mountains — one of Colorado's most dramatic ranges with seven fourteeners, ancient volcanic peaks, and endless wilderness near Purgatory Resort.",
  keywords: [
    'San Juan Mountains Colorado',
    'San Juan Mountains fourteeners',
    'Colorado alpine wilderness',
    'San Juan Mountains guide',
    'mountains near Purgatory Resort',
    'Colorado mountain ranges',
    'San Juan Mountains hiking',
    'southwestern Colorado mountains',
  ],
};

export default function SanJuanMountainsPage() {
  return <SanJuanMountainsClient />;
}
