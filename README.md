# Purgatory Townhouse - Website Scaffold

A modern, responsive website for a luxury Colorado ski town vacation rental property located in the Purgatory area near Durango.

## 🎯 Project Overview

This is a production-ready Next.js website scaffold for showcasing a high-end mountain vacation rental. The site includes booking functionality, property details, image galleries, and comprehensive information for potential guests.

## ✨ Features

### Pages
- **Home**: Hero section with property highlights, amenities showcase, image gallery, and key statistics
- **Property Details**: Complete property information with bedroom descriptions, full amenity list, guest reviews, and booking CTA
- **Booking**: Multi-step booking flow with date picker, pricing calculator, guest information form, and payment preview
- **About/Contact**: Owner story, contact form, location map, and detailed contact information

### Components
- **Header**: Sticky navigation with mobile-responsive menu
- **Footer**: Multi-column footer with contact info and quick links
- **ImageCarousel**: Responsive image gallery with auto-play and manual controls
- **BookingForm**: Interactive form with date picker and real-time pricing calculation
- **AmenityCard**: Reusable component for displaying property features
- **ReviewCard**: Guest review display with star ratings
- **Button**: Flexible button component with multiple variants

### Design System
- **Color Palette**: Mountain-inspired colors (dark teal, gold, sage, rust)
- **Typography**: Serif fonts for headings, clean sans-serif for body text
- **Responsive Design**: Mobile-first approach, optimized for all screen sizes
- **Animations**: Smooth fade-in and slide-up animations for visual appeal

## 🛠 Tech Stack

- **Framework**: Next.js 14+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Images**: Next.js Image component with optimized loading
- **Fonts**: Google Fonts (Inter, Merriweather)

## 📋 Project Structure

```
purgatory-townhouse/
├── app/
│   ├── layout.tsx           # Root layout with metadata
│   ├── globals.css          # Global styles and design tokens
│   ├── page.tsx             # Homepage
│   ├── property/
│   │   └── page.tsx         # Property details page
│   ├── booking/
│   │   └── page.tsx         # Booking flow page
│   └── about/
│       └── page.tsx         # About & contact page
├── components/
│   ├── layout/
│   │   ├── Header.tsx       # Navigation header
│   │   ├── Footer.tsx       # Footer
│   │   └── LayoutWrapper.tsx # Main layout wrapper
│   ├── common/
│   │   ├── Button.tsx       # Reusable button component
│   │   └── ImageCarousel.tsx # Image gallery
│   ├── booking/
│   │   └── BookingForm.tsx  # Booking form component
│   └── property/
│       ├── AmenityCard.tsx  # Amenity display card
│       └── ReviewCard.tsx   # Guest review card
├── public/                  # Static assets
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
├── next.config.ts           # Next.js configuration
└── package.json             # Dependencies

```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/rickybaker13/Purgatory-Townhouse.git
cd purgatory-townhouse
git checkout bot/dev
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:3000
```

## 🎨 Design System

### Colors
```
Mountain Dark: #1a3a3a
Mountain Medium: #2d5a5a
Mountain Light: #4a8a8a
Snow: #f5f5f5
Gold: #d4af37
Sage: #9ca98b
Rust: #b85c41
```

### Typography
- **Headings**: Merriweather (serif)
- **Body**: Inter (sans-serif)

### Spacing & Layout
- Max width: 80rem (1280px)
- Mobile-first responsive breakpoints
- Consistent padding/margins throughout

## 📝 Content Customization

### Update Property Information
- Edit homepage highlights in `app/page.tsx`
- Update amenities list in `app/page.tsx`
- Modify property details in `app/property/page.tsx`
- Add real reviews to `app/property/page.tsx`

### Update Contact Details
- Email: `info@purgatory.local` (update in Footer and About)
- Phone: `(123) 456-7890` (update in Footer and About)
- Address: `Durango, Colorado 81301` (update in Footer and About)

### Update Pricing
- Base price: `$250/night` (modify in BookingForm.tsx)
- Cleaning fee: `$75` (modify in BookingForm.tsx and Booking page)

### Replace Images
- Hero image: Update in `app/page.tsx` line 27
- Property gallery: Update imageArray in relevant components
- About section images: Update in `app/about/page.tsx`

## 🔧 Build & Deploy

### Build for production
```bash
npm run build
npm run start
```

### Deployment Options
- **Vercel** (Recommended): Connect GitHub repo for automatic deployments
- **AWS Amplify**: Push to main branch for CI/CD
- **Docker**: Create containerized deployment
- **Traditional Hosting**: Use `npm run build` and serve `/out` directory

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 640px
- **Tablet**: 641px - 1024px
- **Desktop**: 1025px+

All components are optimized for mobile-first design.

## ✅ Feature Checklist

- [x] Homepage with hero section
- [x] Property details page
- [x] Image carousel gallery
- [x] Multi-step booking flow
- [x] Pricing calculator
- [x] About/Contact page
- [x] Contact form
- [x] Guest review section
- [x] Amenities showcase
- [x] Mobile responsive design
- [x] Sticky header navigation
- [x] Footer with quick links
- [x] TypeScript support
- [x] Tailwind CSS styling
- [x] SEO metadata

## 🚀 Next Steps

1. **Content**
   - Replace placeholder text with actual property details
   - Add real high-quality property photos
   - Add genuine guest reviews
   - Update contact information

2. **Backend Integration**
   - Connect booking form to payment processor (Stripe, Square)
   - Setup email notifications
   - Create admin panel for reservations
   - Integrate calendar availability system

3. **Analytics & SEO**
   - Add Google Analytics
   - Setup Google Search Console
   - Add schema.org structured data
   - Implement Open Graph tags

4. **Features to Add**
   - Real-time availability calendar
   - Payment processing
   - Admin dashboard
   - Email notifications
   - Guest messaging system
   - Multi-language support

## 📄 License

Copyright © 2024 Purgatory Townhouse. All rights reserved.

## 👥 Support

For questions or issues, contact: info@purgatory.local

---

**Ready for Demo**: This scaffold is production-ready and demonstrates a professional, modern booking website for vacation rental properties.
