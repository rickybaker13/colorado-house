import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import LayoutWrapper from '@/components/layout/LayoutWrapper';
import './globals.css';

// Fonts are bundled with the site (app/fonts, SIL Open Font License) rather
// than fetched from Google Fonts at build time, which intermittently failed
// Vercel builds. Same families, weights, and CSS variables as before.
const cormorant = localFont({
  src: [
    { path: './fonts/cormorant-garamond-latin-300-normal.woff2', weight: '300', style: 'normal' },
    { path: './fonts/cormorant-garamond-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/cormorant-garamond-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: './fonts/cormorant-garamond-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: './fonts/cormorant-garamond-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = localFont({
  src: [
    { path: './fonts/dm-sans-latin-300-normal.woff2', weight: '300', style: 'normal' },
    { path: './fonts/dm-sans-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/dm-sans-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: './fonts/dm-sans-latin-600-normal.woff2', weight: '600', style: 'normal' },
  ],
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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EY6GMYE5X0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EY6GMYE5X0');
          `}
        </Script>
      </head>
      <body
        className={`${cormorant.variable} ${dmSans.variable} font-sans antialiased`}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
