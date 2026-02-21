import type { Metadata } from 'next';
import GalleryClient from './GalleryClient';

export const metadata: Metadata = {
  title: 'Photo Gallery | Purgatory Townhouse Colorado',
  description: 'Browse photos of the Purgatory Townhouse — interior, exterior, mountain views, and surrounding San Juan Mountains landscape. See why guests love this Colorado retreat.',
  keywords: [
    'Purgatory Townhouse photos',
    'Colorado mountain rental pictures',
    'Purgatory Resort vacation home gallery',
    'San Juan Mountains rental interior',
    'luxury mountain home photos Colorado',
    'Durango vacation rental gallery',
  ],
};

export default function GalleryPage() {
  return <GalleryClient />;
}
