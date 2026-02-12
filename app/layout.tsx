import type { Metadata } from 'next';
import { Inter, Merriweather } from 'next/font/google';
import LayoutWrapper from '@/components/layout/LayoutWrapper';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'Purgatory Townhouse | Luxury Mountain Vacation Rental in Durango',
  description:
    'Experience luxury mountain living in our stunning Purgatory townhouse near Durango, Colorado. Perfect for ski vacations and summer getaways.',
  keywords: [
    'vacation rental',
    'mountain townhouse',
    'Durango Colorado',
    'Purgatory ski',
    'luxury vacation',
  ],
  authors: [{ name: 'Purgatory Townhouse' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://purgatorytownhouse.com',
    siteName: 'Purgatory Townhouse',
    title: 'Luxury Mountain Vacation Rental in Durango',
    description: 'Book your perfect mountain getaway at Purgatory Townhouse',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${merriweather.variable} font-sans antialiased`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
