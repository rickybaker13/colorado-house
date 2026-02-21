import type { Metadata } from 'next';
import BookingClient from './BookingClient';

export const metadata: Metadata = {
  title: 'Book Your Stay | Purgatory Townhouse Colorado',
  description: 'Book the Purgatory Townhouse directly and save. 4 bedrooms, sleeps 10, steps from Purgatory Resort. Check availability and reserve your Colorado mountain getaway.',
  keywords: [
    'book Purgatory vacation rental',
    'Colorado mountain rental booking',
    'Purgatory Resort accommodation',
    'Durango vacation rental book direct',
    'ski rental reservation Colorado',
    'San Juan Mountains lodging',
    'Purgatory townhouse reservation',
    'Colorado ski vacation booking',
  ],
};

export default function BookingPage() {
  return <BookingClient />;
}
