# NTS Ltd Website - Project Documentation

## Project Overview
Building a modern, professional website for **NTS Ltd**, a mechanical and electrical services company based in Hull, UK. The site features a custom Next.js frontend with an admin dashboard for managing content (news, projects, testimonials).

**Company:** NTS Ltd (Hull, UK)
**Services:** Plumbing & Heating, Ventilation, Domestic & Commercial Servicing, Air Conditioning, Commissioning
**Status:** Phase 1 Complete (Static Homepage) → Phase 2 (Admin Dashboard & Database)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v3 |
| **Database** | SQLite via Prisma 6 |
| **Authentication** | JWT (jose library) + bcryptjs |
| **Animations** | Framer Motion |
| **Icons** | React Icons |
| **Images** | Next.js Image component |

---

## Brand Identity

### Colors
```
Navy Blue: #1a2f6e (primary)
Green: #4caf50 (accent, CTAs, hover states)
White: #ffffff (background)
Light Grey: #f5f5f5 (sections)
Dark Grey/Charcoal: #101828 (footer)
```

### Typography
- **Font:** Inter (Google Fonts via next/font)
- **Heading style:** Bold, tracking-tight
- **Body:** Readable 16px+ on mobile

### UI Patterns
- Green CTAs with `#4caf50` background
- Navy text/headers with `#1a2f6e`
- Rounded corners: `rounded-lg` (8px), `rounded-2xl` (16px)
- Shadows: `shadow-md` (normal), `shadow-lg` (hover)
- Hover effects: opacity changes, scale transforms, color transitions

---

## Project Structure

```
nts-website/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout with fonts
│   │   ├── page.tsx                      # Homepage
│   │   ├── admin/                        # Admin dashboard
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── projects/
│   │   │   ├── testimonials/
│   │   │   ├── news/
│   │   │   └── users/
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── services/page.tsx
│   │   ├── services/[slug]/page.tsx
│   │   ├── projects/page.tsx
│   │   ├── news/page.tsx
│   │   ├── testimonials/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── terms/page.tsx
│   │   └── api/
│   │       ├── auth/
│   │       ├── projects/
│   │       ├── testimonials/
│   │       ├── news/
│   │       └── users/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx               # Sticky nav with blob indicator
│   │   │   ├── NavBlobIndicator.tsx     # Green blob animation
│   │   │   └── Footer.tsx
│   │   └── home/
│   │       ├── Hero.tsx
│   │       ├── StatsStrip.tsx
│   │       ├── AboutSection.tsx
│   │       ├── ServicesGrid.tsx
│   │       ├── LatestProjects.tsx
│   │       ├── Testimonials.tsx
│   │       ├── FeaturedNews.tsx
│   │       └── Contact.tsx
│   ├── lib/
│   │   ├── db.ts                        # Prisma client singleton
│   │   ├── auth.ts                      # JWT helpers
│   │   └── constants.ts                 # Brand colors, copy, nav links
│   ├── middleware.ts                    # Route protection
│   └── globals.css                      # Tailwind imports
├── prisma/
│   ├── schema.prisma                    # Database schema
│   └── seed.ts                          # Seed script
├── public/
│   ├── images/                          # Static images
│   └── uploads/                         # User-uploaded files
└── package.json
```

---

## Database Schema

### Users
```prisma
model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  password  String   (bcrypt hashed)
  createdAt DateTime @default(now())
}
```

### Projects
```prisma
model Project {
  id          Int      @id @default(autoincrement())
  title       String
  description String
  category    String
  date        DateTime @default(now())
  imageUrl    String?  (path to /uploads/projects/)
  featured    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Testimonials
```prisma
model Testimonial {
  id        Int      @id @default(autoincrement())
  name      String
  company   String
  text      String
  rating    Int      @default(5)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### News Items
```prisma
model NewsItem {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  imageUrl  String?  (path to /uploads/news/)
  featured  Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## Key Components

### Navbar (`Navbar.tsx`)
- **Features:**
  - Sticky positioning at top with fade-in on scroll
  - Logo + navigation links (Home, About, Services, Projects, News, Testimonials, Contact)
  - Green blob indicator that animates to current page
  - Mobile hamburger menu (`< 768px`)
  - Text color changes based on background (white on dark, black on light)
  - Navigation gap: 16 units (`gap-16`)

- **Blob Indicator Animation:**
  - Uses `NavBlobIndicator.tsx` component
  - Green (`#4caf50`) rounded blob follows navigation
  - Animates position and width smoothly
  - Syncs with current page via pathname
  - Uses `useMemo` to avoid recalculation

- **Mobile Behavior:**
  - Always white background on mobile
  - Hamburger menu with slide-down animation
  - Text automatically black for readability

### Hero Sections
All dark hero sections standardized to:
```
pt-24 pb-24 sm:py-32 lg:pt-24 min-h-[550px] flex items-center
```
Applied to: About, Contact, Testimonials, Projects, Services, News, Service Detail pages

### Testimonials (`Testimonials.tsx`)
- **Display:** Scroll snap carousel using Tailwind CSS scroll snap
- **Features:**
  - `snap-x snap-mandatory` for snapping behavior
  - `snap-center snap-always` for card alignment
  - `scroll-smooth` for native smooth scrolling
  - Cards scroll and snap into center position
  - Auto-advance every 6 seconds
  - Previous/Next buttons
  - Dot indicators (clickable)
  - Cards fetched from `/api/testimonials`

### Featured News (`FeaturedNews.tsx`)
- Displays top 3 featured news items
- White background section
- Cards with images, dates, titles, snippets
- "News" badge on each card
- Green accent on hover
- Scroll animations

### Projects Section (`LatestProjects.tsx`)
- Displays top 3 projects
- Dark background (`bg-gray-900`)
- Card layout with images, dates, categories
- Green category badges
- Fetches from `/api/projects`
- "View All Projects" button

---

## Admin System

### Authentication
- **Location:** `/admin/login`
- **Method:** Username/Password → JWT in httpOnly cookie
- **Token Library:** `jose` (secure JWT handling)
- **Password Hashing:** bcryptjs
- **Protected Routes:** Middleware redirects unauthenticated users to `/admin/login`

### Admin Dashboard Routes
- `/admin/` - Redirects to `/admin/projects`
- `/admin/projects` - List all projects
- `/admin/projects/new` - Create new project
- `/admin/projects/[id]/edit` - Edit project
- `/admin/testimonials` - List all testimonials
- `/admin/testimonials/new` - Add testimonial
- `/admin/testimonials/[id]/edit` - Edit testimonial
- `/admin/news` - List all news items
- `/admin/news/new` - Create news item
- `/admin/news/[id]/edit` - Edit news item
- `/admin/users` - Manage admin users
- `/admin/users/new` - Create new admin user
- `/admin/users/[id]/edit` - Edit admin user

### File Uploads
- **Projects & News:** Image files uploaded to `public/uploads/[type]/`
- **Naming:** `${Date.now()}-${random}-${originalFilename}`
- **API Routes:** Parse FormData, save file, store path in DB
- **Public Access:** Files accessible at `/uploads/projects/` and `/uploads/news/`

---

## API Routes

### Authentication
- `POST /api/auth/login` - Verify credentials, set JWT cookie
- `POST /api/auth/logout` - Clear JWT cookie

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create project (admin, file upload)
- `GET /api/projects/[id]` - Get single project
- `PUT /api/projects/[id]` - Update project (admin, file upload)
- `DELETE /api/projects/[id]` - Delete project (admin)

### Testimonials
- `GET /api/testimonials` - List all testimonials
- `POST /api/testimonials` - Create testimonial (admin)
- `GET /api/testimonials/[id]` - Get single testimonial
- `PUT /api/testimonials/[id]` - Update testimonial (admin)
- `DELETE /api/testimonials/[id]` - Delete testimonial (admin)

### News
- `GET /api/news` - List all news items
- `POST /api/news` - Create news item (admin, file upload)
- `GET /api/news/[id]` - Get single news item
- `PUT /api/news/[id]` - Update news item (admin, file upload)
- `DELETE /api/news/[id]` - Delete news item (admin)

### Users
- `GET /api/users` - List all admin users (admin)
- `POST /api/users` - Create admin user (admin)
- `GET /api/users/[id]` - Get user (admin)
- `PUT /api/users/[id]` - Update user (admin)
- `DELETE /api/users/[id]` - Delete user (admin)

---

## Important Patterns & Conventions

### Next.js 16 - Async Params
All dynamic route handlers now require async params:
```typescript
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // ...
}
```

### FormData for File Uploads
```typescript
const formData = new FormData();
formData.append("title", title);
formData.append("image", file);

const res = await fetch("/api/endpoint", {
  method: "POST",
  body: formData, // Don't set Content-Type header!
});
```

### Middleware Route Protection
Middleware automatically redirects unauthenticated requests to `/admin/login` and validates JWT cookies.

### Server vs Client Components
- **Server Components:** Pages, data fetching, direct DB access
- **Client Components:** Form handling, state, interactivity (marked with `"use client"`)

### Image Uploads
- Files saved to `public/uploads/[type]/` with unique timestamps
- Path stored in DB as `/uploads/type/filename`
- Accessible directly via public URLs

### Animations
- **Framer Motion:** Scroll entrance animations with `whileInView`, `once: true`
- **Scroll Snap:** Tailwind classes for carousel behavior
- **Transitions:** 200-300ms for hover effects

---

## Styling Notes

### Responsive Design
- **Mobile-first:** Build for mobile, add complexity for larger screens
- **Breakpoints:** `sm: 480px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`
- **Spacing:** 8px grid (`px-4`, `py-6`, `gap-8`, etc.)

### Color Application
- **Primary Buttons:** `bg-[#4caf50]` with `hover:opacity-90`
- **Links:** `text-[#4caf50]` for accent colors
- **Text:** `text-gray-900` (dark content), `text-gray-300`/`text-gray-400` (light background)
- **Borders:** `border-gray-200` (light), `border-gray-700` (dark)

### Shadow Strategy
- Normal state: `shadow-sm` or `shadow-md`
- Hover state: `shadow-lg` or `shadow-xl`
- Transitions: `transition-all duration-200` or `duration-300`

### Navbar Text Colors
- Light/white backgrounds: Black text (`text-black`)
- Dark backgrounds: White text (`text-white`)
- Controlled via conditional styling based on `shouldShowBackground`, `isMobile`, `isHoveringTop`

---

## Current Status

### Completed
✅ Project setup (Next.js 16, Tailwind, Prisma)
✅ Homepage with all sections
✅ Navigation with blob indicator
✅ About page with directors section
✅ Service detail pages ([slug] routes)
✅ Projects, News, Testimonials public pages
✅ Admin authentication system
✅ Admin dashboard (projects, testimonials, news, users)
✅ File upload system for projects/news
✅ Database schema and API routes
✅ Footer with 3-column layout
✅ Scroll snap testimonials carousel
✅ Featured news section on homepage
✅ Responsive design across all pages
✅ Dark hero sections standardized

### In Progress / TODO
- [ ] Additional service detail pages
- [ ] Gallery/Portfolio page
- [ ] SEO optimization (meta tags, sitemap)
- [ ] Analytics integration
- [ ] Performance monitoring
- [ ] Email notifications for admin actions

---

## Useful Links & Resources

### Documentation
- [Next.js 16 Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind Scroll Snap](https://tailwindcss.com/docs/scroll-snap-stop)

### Key Files to Review
- `src/lib/constants.ts` - Brand colors, nav links, services list
- `src/middleware.ts` - Route protection logic
- `src/app/api/` - All API endpoint implementations
- `prisma/schema.prisma` - Complete database schema

---

## Development Workflow

### Local Development
```bash
npm run dev
# Runs on http://localhost:3000
```

### Database
```bash
npx prisma migrate dev
npx prisma db seed
npx prisma studio  # View DB in browser
```

### Building
```bash
npm run build
npm start
```

### Environment Variables
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="changeme123"
```

---

## Important Notes

### Do NOT:
- Modify `selectedIndex` calculation without syncing `hoveredIndex` via useEffect
- Upload files with just URLs - use FormData with actual files
- Change navbar color scheme without updating all pages
- Use hardcoded paths - always use `/uploads/type/` pattern

### Always:
- Test responsive design at 375px, 768px, 1280px
- Check contrast ratios for accessibility
- Verify animations don't block user interaction
- Keep component styling consistent with brand colors
- Use `scroll-smooth` for scroll-based interactions
- Validate form inputs before API submission

### Performance Tips
- Images are lazy-loaded via Next.js Image component
- Use `once: true` with Framer Motion viewport to animate only once
- File uploads use unique timestamps to prevent collisions
- JWT tokens stored in httpOnly cookies for security

---

**Last Updated:** April 2026
**Version:** Phase 1 Complete + Phase 2 Admin System
