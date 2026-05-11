# NTS Ltd Website

Professional website for NTS Ltd, a UK-based mechanical and electrical services company specializing in HVAC solutions.

## About NTS Ltd

NTS Ltd provides comprehensive heating, ventilation, air conditioning, and mechanical services for residential and commercial properties throughout Hull and the surrounding areas.

**Services:**
- Plumbing & Heating
- Ventilation Systems
- Domestic & Commercial Servicing
- Air Conditioning
- System Commissioning

**Accreditations:** Gas Safe Registered | F-Gas Certified

## Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3
- **Animations:** Framer Motion
- **Email Service:** Resend (SMTP via Nodemailer)
- **Hosting:** VPS (PM2)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Harleywill/nts-website.git
cd nts-website

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
src/
├── app/                 # Next.js app router
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Homepage
│   ├── about/          # About page
│   ├── contact/        # Contact page
│   ├── services/       # Services pages
│   └── api/            # API routes (email, etc.)
├── components/         # Reusable React components
│   ├── layout/         # Navbar, Footer
│   └── home/           # Homepage sections
├── lib/                # Utilities and constants
└── public/             # Static assets
```

## Features

- ✅ Responsive design (mobile-first)
- ✅ Fast performance (Lighthouse 90+)
- ✅ Contact form with email notifications
- ✅ Service pages with detailed information
- ✅ Professional branding and styling
- ✅ SEO optimized
- ✅ Accessibility (WCAG AA)

## Building & Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to VPS
```bash
git push origin main
# Pull and rebuild on VPS (automatic via CI/CD)
```

## Environment Variables

Required for production:

```
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_SITE_URL=https://nevilletuckerservices.co.uk
```

## Contact

**Phone:** 01482 838080  
**Email:** info@nevilletuckerservices.co.uk  
**Website:** https://nevilletuckerservices.co.uk

## License

Private repository - All rights reserved © NTS Ltd
