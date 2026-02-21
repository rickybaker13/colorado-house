import type { Metadata } from 'next';
import NeedlesMountainsClient from './NeedlesMountainsClient';

export const metadata: Metadata = {
  title: 'The Needles | Remote Wilderness in the San Juan Mountains',
  description: 'Explore the Needles — one of Colorado's most remote and dramatic wilderness areas in the San Juan Mountains, accessible via the Durango & Silverton Narrow Gauge Railroad.',
  keywords: [
    'Needles Mountains Colorado',
    'San Juan Mountains wilderness',
    'Needles District Colorado',
    'remote hiking Colorado',
    'Weminuche Wilderness Needles',
    'Colorado backcountry hiking',
    'San Juan Mountains remote trails',
    'Needles mountains near Durango',
  ],
};

export default function NeedlesMountainsPage() {
  return <NeedlesMountainsClient />;
}
