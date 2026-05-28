# Google Reviews + TrustPilot Integration Design

**Date:** 2026-05-28  
**Project:** NTS Ltd Website  
**Status:** Approved for Implementation

---

## Overview

Add social proof to the NTS Ltd website through two complementary integrations:

1. **Google Reviews Section** — Display top 3 manually-managed reviews from your Google Business profile in a new homepage section (hybrid approach with existing testimonials)
2. **TrustPilot Footer Badge** — Add a simple trust badge in the footer showing your TrustPilot rating with a link to your profile

---

## Part 1: Google Reviews Section (Homepage)

### Placement & Layout

**Location:** Homepage, below the existing testimonials carousel section

**Layout:** 3-column responsive grid
- Desktop: 3 review cards side-by-side
- Tablet: 2 cards, wraps to 3rd card below
- Mobile: 1 card full-width, scrollable or stacked

**Section Structure:**
```
[Header: "Verified Reviews from Google"]
[Rating badge: ★★★★★ 5.0/5 (127 reviews)]

[Review Card 1] [Review Card 2] [Review Card 3]

[CTA Button: "View All on Google →"]
```

### Review Card Design

Each card displays:
- **Rating:** 5-star display (all reviews will be 5-star)
- **Reviewer Name:** e.g., "Martin Omond"
- **Reviewer Title:** Optional metadata (e.g., "Local Guide · 381 reviews")
- **Review Text:** Full quote from the review
- **CTA:** "Read on Google" with arrow icon, links to Google Business profile
- **Styling:** White background, subtle border, hover shadow effect

### Data Model

New Prisma model: `GoogleReview`

```prisma
model GoogleReview {
  id            Int      @id @default(autoincrement())
  reviewerName  String
  reviewerTitle String?  // e.g., "Local Guide · 381 reviews"
  reviewText    String
  rating        Int      @default(5) // 1-5 stars
  googleUrl     String   // Link to review on Google
  featured      Boolean  @default(false)
  order         Int      @default(0) // Sort order
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### Admin Interface

**New page:** `/admin/reviews` (or `/admin/google-reviews`)

**Features:**
- List view showing all stored reviews
- Add new review form
- Edit existing review form
- Delete review button (with confirmation)
- Toggle "featured" checkbox to show/hide from homepage
- Drag-to-reorder or numeric order field to control card position
- Preview of how review will appear on homepage

**Form Fields:**
- Reviewer Name (required)
- Reviewer Title (optional) — e.g., "Local Guide · 381 reviews"
- Review Text (required, textarea)
- Rating (required, select 1-5, default 5)
- Google URL (required) — direct link to review on Google profile
- Featured (checkbox) — toggles whether review appears on homepage
- Order (number) — determines left-to-right position in 3-card layout

### API Endpoint

**New route:** `/api/google-reviews` (GET)

Returns featured reviews in order:
```json
{
  "reviews": [
    {
      "id": 1,
      "reviewerName": "Martin Omond",
      "reviewerTitle": "Local Guide · 381 reviews",
      "reviewText": "Work visit, as usual super easy, friendly staff",
      "rating": 5,
      "googleUrl": "https://google.com/maps/...",
      "order": 0
    },
    // ... 2 more reviews
  ]
}
```

### Frontend Component

**New component:** `src/components/home/GoogleReviewsSection.tsx`

- Client component that fetches `/api/google-reviews` on mount
- Displays reviews in 3-column grid (responsive)
- Each card is clickable and links to Google via `googleUrl`
- Shows 5-star rating display
- Hover effects: subtle shadow and scale on desktop
- Loading state while fetching
- Error handling if API fails

### Styling Notes

- **Colors:** Use existing NTS green (#4caf50) for stars, CTA text, and accents
- **Typography:** Inter font, consistent with site
- **Spacing:** Align with existing section padding and margins
- **Responsive:** Same breakpoints as rest of site (md: 768px, lg: 1024px)

### User Journey

1. Visitor scrolls homepage past testimonials carousel
2. Sees "Verified Reviews from Google" section
3. Reads top 3 reviews (Martin, Tom, Matthew with their actual text)
4. Clicks any review card → opens Google Business profile in new tab
5. Can see full review and all other reviews on Google

### Admin Journey

1. Admin logs in and navigates to `/admin/reviews`
2. Sees list of all stored reviews
3. Can add new review by clicking "Add Review"
4. Fills form with reviewer name, text, Google URL
5. Toggles "Featured" checkbox if review should appear on homepage
6. Sets order (0, 1, 2 for the 3 visible cards)
7. Saves → changes appear immediately on homepage
8. Can edit or delete reviews anytime

---

## Part 2: TrustPilot Footer Badge

### Placement & Design

**Location:** Footer, aligned with existing trust signals and company info

**Badge Display:**
```
[TrustPilot Logo] [5-star rating] [Rating number] [Click to view reviews]
```

**Style:**
- Subtle, compact badge format
- Consistent with footer typography and color scheme
- Link to TrustPilot profile opens in new tab

### Implementation

**Method:** Static HTML badge + link in Footer component  
(TrustPilot also provides embeddable widgets, but simple link is sufficient)

**Content:** 
- TrustPilot logo (provided by TrustPilot or icon)
- "4.X out of 5" or similar rating display
- Link: `https://www.trustpilot.com/review/ntsltd.co.uk` (adjust URL to your actual TrustPilot profile)

**Styling:**
- Positioned in footer, likely in the contact/trust section
- Line-height aligned with other footer links
- Hover color change to green (#4caf50) to match site theme
- No separate update mechanism needed — hardcoded in Footer component with manual URL updates only if rating changes significantly

### Future Expansion

If desired later, TrustPilot reviews can be integrated the same way as Google Reviews (admin-managed section, database storage, API fetching). This badge is the minimal, maintenance-free version.

---

## Technical Summary

### What's Being Added

| Component | Type | Effort | Notes |
|-----------|------|--------|-------|
| GoogleReview Prisma model | Database | 5 min | New table, simple schema |
| /api/google-reviews endpoint | API | 10 min | Simple GET endpoint, filter by featured |
| /admin/reviews page | Admin UI | 30 min | List, add, edit, delete forms |
| GoogleReviewsSection component | Frontend | 20 min | Responsive grid, click handling |
| Footer TrustPilot badge | Frontend | 5 min | Simple link + styling |
| Database migration | Database | 2 min | Create GoogleReview table |

### No Breaking Changes

- Existing testimonials carousel untouched
- Existing footer structure preserved
- New features are purely additive
- No API dependency on Google or TrustPilot (manual management)

### Testing Checklist

- [ ] GoogleReview table created and migrated
- [ ] /api/google-reviews returns correct data
- [ ] Admin reviews page loads and CRUD operations work
- [ ] Homepage displays 3 featured reviews correctly
- [ ] Review cards are clickable and link to Google
- [ ] Responsive layout works on mobile/tablet/desktop
- [ ] TrustPilot badge appears in footer
- [ ] TrustPilot link opens correct profile

---

## Success Criteria

✓ Google Reviews section displays on homepage below testimonials  
✓ Top 3 reviews are clickable and link to Google Business profile  
✓ Admin can manage which reviews are featured via dashboard  
✓ TrustPilot badge appears in footer with link to profile  
✓ No manual data entry required beyond initial setup  
✓ Responsive design matches existing homepage  
✓ Zero dependencies on external APIs (manual updates only)

---

## Scope Notes

**In Scope:**
- Database schema and API for Google Reviews
- Admin CRUD interface for reviews
- Homepage section component
- TrustPilot footer badge
- Basic styling and responsiveness

**Out of Scope (Future):**
- Automatic Google API integration (sync reviews in real-time)
- TrustPilot reviews section (similar to Google, if desired later)
- Advanced analytics on review engagement
- Review moderation workflow

---

## Files to Create/Modify

### Create
- `prisma/migrations/[timestamp]_add_google_reviews/migration.sql`
- `src/app/api/google-reviews/route.ts`
- `src/app/admin/reviews/page.tsx`
- `src/components/admin/reviews/ReviewForm.tsx`
- `src/components/home/GoogleReviewsSection.tsx`

### Modify
- `prisma/schema.prisma` — add GoogleReview model
- `src/components/layout/Footer.tsx` — add TrustPilot badge
- `src/app/admin/layout.tsx` — add Reviews link to admin nav

---

**Ready for implementation planning.**