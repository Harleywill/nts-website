# NTS Ltd Website Enhancement Spec
**Date:** 2026-06-04  
**Scope:** Admin Authentication Security, Logo Switcher, Trust Messaging

---

## Overview

Three interconnected features to improve admin security, branding flexibility, and customer trust:

1. **Secure Admin Authentication** — Server-side auth protection for `/admin` routes
2. **Logo Switcher** — Admin toggle to switch between old/new logos
3. **Trust & Contact Optimization** — "24-hour response" messaging + prominent click-to-call

---

## Feature 1: Secure Admin Authentication

### Problem
- Current middleware is disabled (all routes allowed)
- Client-side ProtectedLayout only checks for a cookie that can be manipulated
- Security vulnerability: anyone can access admin dashboard via browser console

### Solution
- Enable server-side middleware to verify admin session
- Check user role is ADMIN before granting access to `/admin`
- Use secure HTTP-only cookies (immune to JS manipulation)
- Redirect unauthenticated/unauthorized users to login page

### Implementation Details
- **Middleware:** `src/middleware.ts` — Check for valid session + ADMIN role on all `/admin/*` routes
- **Auth Method:** Session cookie set on login (already exists in `/admin/login`)
- **Behavior:**
  - Unauthenticated → redirect to `/admin/login`
  - Authenticated but not ADMIN role → redirect to home page
  - ADMIN → allow access to admin routes

### Testing
- ✅ Can access `/admin` when logged in as ADMIN
- ✅ Redirects to login when not authenticated
- ✅ Redirects to home when authenticated but not ADMIN role
- ✅ Can't bypass with manually set cookies

---

## Feature 2: Logo Switcher

### Problem
- Currently no way to swap between old and new logos without code changes
- Need admin flexibility to change branding on the fly

### Solution
- Add toggle button in admin dashboard header
- Toggle switches between old/new logo
- Preference persists in database (SiteSettings table)
- Public site automatically shows current logo selection

### Implementation Details
- **Database:** Use existing `SiteSettings` table
  - Add column: `logoVersion` (enum: 'old' | 'new', default: 'new')
- **Admin UI:** Add toggle button in `AdminShell` header
  - Shows current logo version
  - Click to toggle between old/new
  - Calls `PUT /api/admin/settings` to save preference
- **Public Site:** Update `Navbar.tsx` and logo components to:
  - Query current `logoVersion` from SiteSettings
  - Display appropriate logo based on setting
  - Cache in React component (no flicker)

### API Endpoint
- **Route:** `src/app/api/admin/settings/route.ts` (already exists)
- **Method:** `PUT`
- **Payload:** `{ logoVersion: 'old' | 'new' }`
- **Response:** Updated SiteSettings object

### Testing
- ✅ Admin can toggle logo in dashboard
- ✅ Logo preference saves to database
- ✅ Public site displays current logo on page load
- ✅ Logo switches immediately without page reload
- ✅ Logo preference persists across sessions

---

## Feature 3: Trust & Contact Optimization

### Problem
- No clear signal about response time (visitors don't know how fast you respond)
- Phone number not prominently clickable
- Sticky mobile CTA is intrusive and being removed

### Solution
- Add "We respond within 24 hours" trust messaging on key pages
- Make phone number clickable/prominent everywhere
- Remove intrusive sticky mobile CTA

### Placement Strategy

**"We respond within 24 hours" message:**
- Contact page: Above/below contact form
- Contact form component: Above submit button
- Services pages: Near service cards CTAs
- About page: Near company description

**Click-to-call button:**
- Navbar: Make phone number `<a href="tel:...">` with bold styling
- Footer: Ensure phone is clickable
- Contact page: Large clickable phone button
- Mobile: Ensure all touch targets are 48px+ height

**Sticky CTA removal:**
- Delete sticky contact button from mobile layout
- Verify normal CTAs are sufficient

### Implementation Details
- **Components affected:**
  - `Navbar.tsx` — Make phone clickable
  - `Footer.tsx` — Ensure phone clickable
  - `Contact.tsx` (page) — Add trust message + large call button
  - `ServicesGrid.tsx` — Add trust message to cards
  - `AboutSection.tsx` — Add trust message
  - `DeleteButton.tsx` (or similar) — Remove sticky mobile CTA

- **Trust message copy:** 
  ```
  "We respond within 24 hours"
  ```

- **Styling:**
  - Trust message: Smaller text, slightly muted color, consistent placement
  - Phone button: Bold, green accent, clear CTA styling
  - Touch targets: 48px minimum on mobile

### Testing
- ✅ "24-hour response" visible on Contact page
- ✅ "24-hour response" visible on Services pages
- ✅ Phone number clickable on all pages (tel: links)
- ✅ Phone opens dialer on mobile
- ✅ Sticky mobile CTA is removed
- ✅ No layout shifts or broken links

---

## Database Schema Changes

### SiteSettings (Update)
```prisma
model SiteSettings {
  id          Int      @id @default(autoincrement())
  companyName String
  phone       String
  email       String
  address     String?
  city        String?
  postalCode  String?
  facebookUrl String?
  linkedinUrl String?
  twitterUrl  String?
  logoVersion String   @default("new")  // NEW: "old" or "new"
  updatedAt   DateTime @updatedAt
}
```

---

## Files to Create/Modify

### New Files
- None required (using existing components and API routes)

### Modified Files
- `src/middleware.ts` — Enable admin auth checking
- `src/app/api/admin/settings/route.ts` — Add PUT handler for logoVersion
- `prisma/schema.prisma` — Add logoVersion column to SiteSettings
- `src/components/layout/Navbar.tsx` — Make phone clickable, logo switcher
- `src/components/admin/shell/AdminShell.tsx` — Add logo toggle button
- `src/app/admin/dashboard/page.tsx` — (if needed for instructions)
- `src/app/(public)/contact/page.tsx` — Add trust message + call button
- `src/components/home/ServicesGrid.tsx` — Add trust message
- `src/components/home/AboutSection.tsx` — Add trust message
- (Remove sticky mobile CTA from relevant component)

---

## Rollout Plan

### Phase 1: Admin Auth (15 minutes)
1. Enable middleware
2. Test auth flows
3. Deploy

### Phase 2: Logo Switcher (30 minutes)
1. Add DB column + API handler
2. Build admin toggle button
3. Update public site logo logic
4. Test toggle + persistence
5. Deploy

### Phase 3: Trust Messaging (30 minutes)
1. Add "24-hour response" text to pages
2. Make phone clickable everywhere
3. Remove sticky mobile CTA
4. Test on mobile/desktop
5. Deploy

---

## Success Criteria

- ✅ Admin pages require valid ADMIN session (can't bypass with cookies)
- ✅ Logo can be toggled from admin dashboard and persists
- ✅ "We respond within 24 hours" visible on key pages
- ✅ Phone number clickable on all devices
- ✅ Sticky mobile CTA removed without breaking layout
- ✅ All tests passing
- ✅ No console errors

---

## Notes

- No breaking changes to public API
- Database migration required for logoVersion column
- All changes are non-destructive (can rollback easily)
- Timeline: 3-4 hours total implementation
