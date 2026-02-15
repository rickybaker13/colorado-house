import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import LayoutWrapper from '@/components/layout/LayoutWrapper';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Purgatory Townhouse | Mountain Living in the San Juans',
  description:
    'A luxury mountain retreat nestled in Purgatory, Colorado. Four bedrooms, breathtaking alpine views, and direct access to the San Juan Mountains.',
  keywords: [
    'Purgatory Colorado',
    'mountain vacation rental',
    'San Juan Mountains',
    'Durango luxury rental',
    'ski vacation Colorado',
    'alpine retreat',
  ],
  authors: [{ name: 'Purgatory Townhouse' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://colorado-house.vercel.app',
    siteName: 'Purgatory Townhouse',
    title: 'Purgatory Townhouse | Mountain Living in the San Juans',
    description:
      'A luxury mountain retreat nestled in Purgatory, Colorado. Breathtaking alpine views and direct access to the San Juan Mountains.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${dmSans.variable} font-sans antialiased`}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
