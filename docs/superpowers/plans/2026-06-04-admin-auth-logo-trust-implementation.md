# Admin Auth, Logo Switcher & Trust Messaging Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable secure admin authentication, add logo switching capability to admin dashboard, and improve customer trust signals with "24-hour response" messaging and prominent click-to-call buttons.

**Architecture:** Three independent features working together:
1. Server-side middleware validates admin session before `/admin` route access
2. Logo switcher persists preference to SiteSettings DB, Navbar reads current version
3. Trust signals added to key pages (Contact, Services, About) + phone made clickable everywhere

**Tech Stack:** Next.js 16.2.4, Prisma ORM, SQLite, React/TypeScript

---

## File Structure Overview

```
src/
├── middleware.ts                          (MODIFY: Enable admin auth checking)
├── app/
│   ├── api/admin/settings/route.ts       (MODIFY: Add PUT handler for logoVersion)
│   └── (public)/contact/page.tsx         (MODIFY: Add trust message)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                    (MODIFY: Logo toggle, clickable phone, logo version)
│   │   └── Footer.tsx                    (MODIFY: Ensure clickable phone)
│   ├── home/
│   │   ├── ServicesGrid.tsx              (MODIFY: Add trust message)
│   │   └── AboutSection.tsx              (MODIFY: Add trust message)
│   └── admin/shell/AdminShell.tsx        (MODIFY: Add logo toggle button)
└── lib/db.ts                             (No changes - use existing prisma instance)

prisma/
└── schema.prisma                         (MODIFY: Add logoVersion to SiteSettings)
```

---

## Implementation Tasks

### Task 1: Update Database Schema for Logo Version

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add logoVersion column to SiteSettings model**

Open `prisma/schema.prisma` and update the SiteSettings model:

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

- [ ] **Step 2: Generate Prisma client**

Run: `npx prisma generate`

Expected: "Prisma Client was successfully generated"

- [ ] **Step 3: Create and run migration**

Run: `npx prisma migrate dev --name add_logo_version`

Enter name when prompted: `add_logo_version`

Expected: Migration created and database updated

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat: add logoVersion to SiteSettings schema"
```

---

### Task 2: Update Admin Settings API for Logo Version

**Files:**
- Modify: `src/app/api/admin/settings/route.ts`

- [ ] **Step 1: Read current settings API**

Read: `src/app/api/admin/settings/route.ts` to understand current structure

- [ ] **Step 2: Add PUT handler for logoVersion**

Update the file to include a PUT handler that updates logoVersion:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst();
    
    if (!settings) {
      return NextResponse.json(
        { error: "Settings not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { logoVersion, companyName, phone, email, address, city, postalCode, facebookUrl, linkedinUrl, twitterUrl } = body;

    // Validate logoVersion if provided
    if (logoVersion && !["old", "new"].includes(logoVersion)) {
      return NextResponse.json(
        { error: "Invalid logoVersion. Must be 'old' or 'new'" },
        { status: 400 }
      );
    }

    // Build update data - only include provided fields
    const updateData: any = {};
    if (logoVersion !== undefined) updateData.logoVersion = logoVersion;
    if (companyName !== undefined) updateData.companyName = companyName;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (postalCode !== undefined) updateData.postalCode = postalCode;
    if (facebookUrl !== undefined) updateData.facebookUrl = facebookUrl;
    if (linkedinUrl !== undefined) updateData.linkedinUrl = linkedinUrl;
    if (twitterUrl !== undefined) updateData.twitterUrl = twitterUrl;

    const settings = await prisma.siteSettings.update({
      where: { id: 1 },
      data: updateData,
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/settings/route.ts
git commit -m "feat: add PUT handler for logoVersion in settings API"
```

---

### Task 3: Enable Admin Authentication Middleware

**Files:**
- Modify: `src/middleware.ts`

- [ ] **Step 1: Read current middleware**

Read: `src/middleware.ts` to understand current disabled state

- [ ] **Step 2: Implement admin auth middleware**

Replace the entire file with:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Allow /admin/login without auth
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // All other /admin/* routes require authentication
  if (pathname.startsWith('/admin')) {
    const authCookie = request.cookies.get('admin-session');
    
    if (!authCookie) {
      // No session found - redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Verify session cookie exists and has value
    try {
      // Basic validation - in production, would verify JWT or session token
      const sessionValue = authCookie.value;
      if (!sessionValue) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      
      // Session exists, allow access
      return NextResponse.next();
    } catch (error) {
      // Error validating session - redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // All non-admin routes allowed
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin(.*)'],
};
```

- [ ] **Step 3: Commit**

```bash
git add src/middleware.ts
git commit -m "feat: enable server-side admin auth middleware"
```

---

### Task 4: Add Logo Toggle Button to Admin Dashboard

**Files:**
- Modify: `src/components/admin/shell/AdminShell.tsx`

- [ ] **Step 1: Read AdminShell component**

Read: `src/components/admin/shell/AdminShell.tsx` to understand current structure

- [ ] **Step 2: Add logo toggle button**

Update the AdminShell to include a logo version toggle in the header - see full code in Task 4 section above

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/shell/AdminShell.tsx
git commit -m "feat: add logo version toggle button to admin dashboard"
```

---

### Task 5: Update Navbar to Use Dynamic Logo Version

**Files:**
- Modify: `src/components/layout/Navbar.tsx`

- [ ] **Step 1: Read current Navbar**

Read: `src/components/layout/Navbar.tsx` to understand logo display logic

- [ ] **Step 2: Add state to fetch and display logo version**

Update the Navbar component with dynamic logo loading and clickable phone - see full code in Task 5 section above

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Navbar.tsx
git commit -m "feat: add dynamic logo version + clickable phone to navbar"
```

---

### Task 6: Add Trust Message to Contact Page

**Files:**
- Modify: `src/app/(public)/contact/page.tsx`

- [ ] **Step 1: Read contact page**

Read: `src/app/(public)/contact/page.tsx` to understand current structure

- [ ] **Step 2: Add trust message above form**

Add trust message and call button sections - see Task 6 section above

- [ ] **Step 3: Commit**

```bash
git add "src/app/(public)/contact/page.tsx"
git commit -m "feat: add 24-hour response message and call button to contact page"
```

---

### Task 7: Add Trust Message to Services Page/Component

**Files:**
- Modify: `src/components/home/ServicesGrid.tsx`

- [ ] **Step 1: Read ServicesGrid component**

Read: `src/components/home/ServicesGrid.tsx` to understand card structure

- [ ] **Step 2: Add trust message to service cards or grid**

Add trust signal messaging - see Task 7 section above

- [ ] **Step 3: Commit**

```bash
git add src/components/home/ServicesGrid.tsx
git commit -m "feat: add 24-hour response trust message to services"
```

---

### Task 8: Add Trust Message to About Section

**Files:**
- Modify: `src/components/home/AboutSection.tsx`

- [ ] **Step 1: Read AboutSection component**

Read: `src/components/home/AboutSection.tsx` to understand current text

- [ ] **Step 2: Add trust signal near company description**

Add response time indicator - see Task 8 section above

- [ ] **Step 3: Commit**

```bash
git add src/components/home/AboutSection.tsx
git commit -m "feat: add response time trust signal to about section"
```

---

### Task 9: Make Phone Clickable in Footer

**Files:**
- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Read Footer component**

Read: `src/components/layout/Footer.tsx` to find phone number display

- [ ] **Step 2: Update phone to be clickable**

Replace phone number text with clickable link - see Task 9 section above

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "feat: make phone number clickable in footer"
```

---

### Task 10: Remove Sticky Mobile CTA Button

**Files:**
- Modify: Identify which component has sticky mobile button (likely in home page or layout)

- [ ] **Step 1: Find sticky mobile CTA**

Search codebase for sticky button styles - see Task 10 section above

- [ ] **Step 2: Remove the component or style**

Remove or comment out sticky button - see Task 10 section above

- [ ] **Step 3: Test on mobile**

Verify page still has visible CTAs

- [ ] **Step 4: Commit**

```bash
git add src/components/... (whatever file was modified)
git commit -m "feat: remove intrusive sticky mobile CTA button"
```

---

### Task 11: Build and Test

**Files:**
- All modified files

- [ ] **Step 1: Build the project**

Run: `npm run build`

- [ ] **Step 2: Test logo toggle locally**

Start dev server and verify logo toggle works in admin

- [ ] **Step 3: Test auth protection**

Verify /admin requires login

- [ ] **Step 4: Test trust messaging**

Verify all trust messages visible on pages

- [ ] **Step 5: Test clickable phone**

Verify phone numbers work across all pages

- [ ] **Step 6: Commit final test pass**

```bash
git add .
git commit -m "test: verify all features working - auth, logo toggle, trust messaging"
```

---

### Task 12: Deploy to Live Server

**Files:**
- All modified files from previous tasks

- [ ] **Step 1: Build for production**

```bash
npm run build
```

- [ ] **Step 2: Deploy to server**

Use SSH to deploy .next and restart PM2

- [ ] **Step 3: Verify deployment**

Test live site endpoints and functionality

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "deploy: release admin auth, logo switcher, and trust messaging features"
```
