# Google Reviews + TrustPilot Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Google Reviews section to homepage and TrustPilot badge to footer, with admin dashboard for managing featured reviews.

**Architecture:** New `GoogleReview` Prisma model stores review data. Admin dashboard provides CRUD interface. API endpoint `/api/google-reviews` returns featured reviews. Frontend component fetches and displays them on homepage. TrustPilot badge is static HTML in footer.

**Tech Stack:** Prisma ORM, Next.js 15 App Router, TypeScript, Tailwind CSS, React Icons (FaStar)

---

## File Structure Overview

**Create:**
- `prisma/migrations/[timestamp]_add_google_reviews/migration.sql` — Database migration
- `src/app/api/google-reviews/route.ts` — GET endpoint for featured reviews
- `src/app/admin/reviews/page.tsx` — Admin list/management page
- `src/components/admin/reviews/ReviewForm.tsx` — Add/edit review form component
- `src/components/home/GoogleReviewsSection.tsx` — Homepage reviews display component

**Modify:**
- `prisma/schema.prisma` — Add GoogleReview model
- `src/components/layout/Footer.tsx` — Add TrustPilot badge
- `src/app/admin/layout.tsx` — Add Reviews navigation link

---

## Task 1: Add GoogleReview Model to Prisma Schema

**Files:**
- Modify: `prisma/schema.prisma` (at end, before closing brace)

- [ ] **Step 1: Add GoogleReview model to schema**

Open `prisma/schema.prisma` and add this model at the end (before the final closing brace if there is one, or just before EOF):

```prisma
model GoogleReview {
  id            Int      @id @default(autoincrement())
  reviewerName  String
  reviewerTitle String?
  reviewText    String   @db.Text
  rating        Int      @default(5)
  googleUrl     String
  featured      Boolean  @default(false)
  order         Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

- [ ] **Step 2: Create and run migration**

```bash
cd /var/www/ntsltd
npx prisma migrate dev --name add_google_reviews
```

Expected output:
```
✔ Your database has been successfully migrated to `[timestamp]_add_google_reviews`
```

- [ ] **Step 3: Verify migration succeeded**

```bash
npx prisma studio
```

You should see `GoogleReview` table in the sidebar. Close Prisma Studio (Ctrl+C).

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat: add GoogleReview database model and migration"
```

---

## Task 2: Create Google Reviews API Endpoint

**Files:**
- Create: `src/app/api/google-reviews/route.ts`

- [ ] **Step 1: Create the route file**

Create new file `src/app/api/google-reviews/route.ts` with this content:

```typescript
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const reviews = await prisma.googleReview.findMany({
      where: {
        featured: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json({
      reviews,
    });
  } catch (error) {
    console.error("Error fetching Google reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Test the endpoint locally**

```bash
npm run dev
```

Visit `http://localhost:3000/api/google-reviews`

Expected: 
```json
{
  "reviews": []
}
```

(Empty because we haven't added reviews yet)

- [ ] **Step 3: Commit**

```bash
git add src/app/api/google-reviews/route.ts
git commit -m "feat: create GET /api/google-reviews endpoint"
```

---

## Task 3: Create Admin Reviews List Page

**Files:**
- Create: `src/app/admin/reviews/page.tsx`

- [ ] **Step 1: Create the admin reviews page**

Create new file `src/app/admin/reviews/page.tsx`:

```typescript
import Link from "next/link";
import { prisma } from "@/lib/db";
import { FaStar, FaEdit, FaTrash } from "react-icons/fa";

export default async function ReviewsPage() {
  const reviews = await prisma.googleReview.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Google Reviews</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage reviews displayed on your homepage
          </p>
        </div>
        <Link
          href="/admin/reviews/new"
          className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
        >
          + Add Review
        </Link>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                Reviewer
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                Review Text
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
                Rating
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
                Featured
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
                Order
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No reviews added yet
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">
                      {review.reviewerName}
                    </p>
                    {review.reviewerTitle && (
                      <p className="text-xs text-gray-600">{review.reviewerTitle}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {review.reviewText}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <FaStar key={i} size={14} style={{ color: "#f59e0b" }} />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        review.featured
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {review.featured ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-semibold text-gray-700">
                      {review.order}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/reviews/${review.id}`}
                        className="p-2 hover:bg-gray-100 rounded transition-colors text-gray-600 hover:text-green-600"
                        title="Edit"
                      >
                        <FaEdit size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Test the page**

```bash
npm run dev
```

Visit `http://localhost:3000/admin/reviews`

Expected: Page loads with empty table and "+ Add Review" button

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/reviews/page.tsx
git commit -m "feat: create admin reviews list page"
```

---

## Task 4: Create Review Form Component

**Files:**
- Create: `src/components/admin/reviews/ReviewForm.tsx`

- [ ] **Step 1: Create the form component**

Create new file `src/components/admin/reviews/ReviewForm.tsx`:

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
  initialData?: {
    id: number;
    reviewerName: string;
    reviewerTitle: string | null;
    reviewText: string;
    rating: number;
    googleUrl: string;
    featured: boolean;
    order: number;
  };
}

export default function ReviewForm({ initialData }: ReviewFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    reviewerName: initialData?.reviewerName || "",
    reviewerTitle: initialData?.reviewerTitle || "",
    reviewText: initialData?.reviewText || "",
    rating: initialData?.rating || 5,
    googleUrl: initialData?.googleUrl || "",
    featured: initialData?.featured ?? false,
    order: initialData?.order || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const method = initialData ? "PATCH" : "POST";
      const url = initialData
        ? `/api/admin/reviews/${initialData.id}`
        : "/api/admin/reviews";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save review");
      }

      router.push("/admin/reviews");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Reviewer Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Reviewer Name *
        </label>
        <input
          type="text"
          required
          value={formData.reviewerName}
          onChange={(e) =>
            setFormData({ ...formData, reviewerName: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="e.g., Martin Omond"
        />
      </div>

      {/* Reviewer Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Reviewer Title (optional)
        </label>
        <input
          type="text"
          value={formData.reviewerTitle}
          onChange={(e) =>
            setFormData({ ...formData, reviewerTitle: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="e.g., Local Guide · 381 reviews"
        />
      </div>

      {/* Review Text */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Review Text *
        </label>
        <textarea
          required
          value={formData.reviewText}
          onChange={(e) =>
            setFormData({ ...formData, reviewText: e.target.value })
          }
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Enter the full review text..."
        />
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Rating *
        </label>
        <select
          value={formData.rating}
          onChange={(e) =>
            setFormData({ ...formData, rating: parseInt(e.target.value) })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value={5}>⭐⭐⭐⭐⭐ 5 Stars</option>
          <option value={4}>⭐⭐⭐⭐ 4 Stars</option>
          <option value={3}>⭐⭐⭐ 3 Stars</option>
          <option value={2}>⭐⭐ 2 Stars</option>
          <option value={1}>⭐ 1 Star</option>
        </select>
      </div>

      {/* Google URL */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Google Review URL *
        </label>
        <input
          type="url"
          required
          value={formData.googleUrl}
          onChange={(e) =>
            setFormData({ ...formData, googleUrl: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="https://google.com/maps/..."
        />
      </div>

      {/* Featured */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="featured"
          checked={formData.featured}
          onChange={(e) =>
            setFormData({ ...formData, featured: e.target.checked })
          }
          className="w-4 h-4 rounded border-gray-300 text-green-500 focus:ring-green-500"
        />
        <label htmlFor="featured" className="text-sm font-semibold text-gray-900">
          Featured (show on homepage)
        </label>
      </div>

      {/* Order */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Display Order (0, 1, 2)
        </label>
        <input
          type="number"
          min={0}
          max={2}
          value={formData.order}
          onChange={(e) =>
            setFormData({ ...formData, order: parseInt(e.target.value) })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : initialData ? "Update Review" : "Add Review"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/reviews/ReviewForm.tsx
git commit -m "feat: create review form component with validation"
```

---

## Task 5: Create Admin Review Pages (New & Edit)

**Files:**
- Create: `src/app/admin/reviews/new/page.tsx`
- Create: `src/app/admin/reviews/[id]/page.tsx`

- [ ] **Step 1: Create new review page**

Create `src/app/admin/reviews/new/page.tsx`:

```typescript
import ReviewForm from "@/components/admin/reviews/ReviewForm";

export default function NewReviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Review</h1>
        <p className="text-sm text-gray-600 mt-1">
          Add a new Google review to display on your homepage
        </p>
      </div>
      <ReviewForm />
    </div>
  );
}
```

- [ ] **Step 2: Create edit review page**

Create `src/app/admin/reviews/[id]/page.tsx`:

```typescript
import ReviewForm from "@/components/admin/reviews/ReviewForm";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function EditReviewPage({
  params,
}: {
  params: { id: string };
}) {
  const review = await prisma.googleReview.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!review) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Review</h1>
        <p className="text-sm text-gray-600 mt-1">
          Update the review from {review.reviewerName}
        </p>
      </div>
      <ReviewForm initialData={review} />
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/reviews/new/page.tsx src/app/admin/reviews/\[id\]/page.tsx
git commit -m "feat: add new and edit review pages"
```

---

## Task 6: Create Admin Reviews API Routes (Create, Update, Delete)

**Files:**
- Create: `src/app/api/admin/reviews/route.ts`
- Create: `src/app/api/admin/reviews/[id]/route.ts`

- [ ] **Step 1: Create POST and GET endpoint**

Create `src/app/api/admin/reviews/route.ts`:

```typescript
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const review = await prisma.googleReview.create({
      data: {
        reviewerName: body.reviewerName,
        reviewerTitle: body.reviewerTitle || null,
        reviewText: body.reviewText,
        rating: body.rating || 5,
        googleUrl: body.googleUrl,
        featured: body.featured || false,
        order: body.order || 0,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const reviews = await prisma.googleReview.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Create PATCH and DELETE endpoint**

Create `src/app/api/admin/reviews/[id]/route.ts`:

```typescript
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const id = parseInt(params.id);

    const review = await prisma.googleReview.update({
      where: { id },
      data: {
        reviewerName: body.reviewerName,
        reviewerTitle: body.reviewerTitle || null,
        reviewText: body.reviewText,
        rating: body.rating || 5,
        googleUrl: body.googleUrl,
        featured: body.featured || false,
        order: body.order || 0,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    await prisma.googleReview.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/reviews/
git commit -m "feat: create admin reviews API endpoints (POST, PATCH, DELETE)"
```

---

## Task 7: Create Google Reviews Frontend Component

**Files:**
- Create: `src/components/home/GoogleReviewsSection.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/home/GoogleReviewsSection.tsx`:

```typescript
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

interface GoogleReview {
  id: number;
  reviewerName: string;
  reviewerTitle: string | null;
  reviewText: string;
  rating: number;
  googleUrl: string;
}

export default function GoogleReviewsSection() {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/google-reviews");
        if (!response.ok) throw new Error("Failed to fetch reviews");
        const data = await response.json();
        setReviews(data.reviews || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading || reviews.length === 0) {
    return null;
  }

  return (
    <section className="relative isolate overflow-hidden bg-gray-50 px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center gap-2 mb-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} size={20} style={{ color: "#f59e0b" }} />
              ))}
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-2">
            Verified Reviews from Google
          </h2>
          <p className="text-lg text-gray-600">
            Trusted by customers across the UK
          </p>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {reviews.map((review, index) => (
            <motion.a
              key={review.id}
              href={review.googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              className="group block"
            >
              <div className="bg-white rounded-lg border border-gray-200 p-6 h-full transition-all hover:shadow-lg hover:border-green-400">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <FaStar key={i} size={16} style={{ color: "#f59e0b" }} />
                  ))}
                </div>

                {/* Reviewer Info */}
                <div className="mb-4">
                  <p className="font-semibold text-gray-900">
                    {review.reviewerName}
                  </p>
                  {review.reviewerTitle && (
                    <p className="text-sm text-gray-600">{review.reviewerTitle}</p>
                  )}
                </div>

                {/* Review Text */}
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {review.reviewText}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-2 text-green-600 group-hover:text-green-700 font-semibold text-sm">
                  <span>Read on Google</span>
                  <span>→</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <a
            href="https://google.com/maps/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 border-2 border-green-500 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors"
          >
            View All Reviews on Google →
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/home/GoogleReviewsSection.tsx
git commit -m "feat: create GoogleReviewsSection component with responsive grid"
```

---

## Task 8: Integrate GoogleReviewsSection into Homepage

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Import and add component to homepage**

Open `src/app/page.tsx` and find the import statements at the top. Add:

```typescript
import GoogleReviewsSection from "@/components/home/GoogleReviewsSection";
```

Then locate where the `Testimonials` component is rendered (should be near the end of the JSX return). Add the new section right after it:

```typescript
{/* Google Reviews Section - right after Testimonials */}
<GoogleReviewsSection />
```

The order should be:
1. Hero
2. StatsStrip
3. AboutSection
4. ServicesGrid
5. AccreditationsStrip
6. LatestProjects
7. Testimonials
8. **GoogleReviewsSection** ← NEW, added here
9. QuickEnquiry
10. Footer

- [ ] **Step 2: Test homepage**

```bash
npm run dev
```

Visit `http://localhost:3000`

Scroll down past testimonials - you should see the Google Reviews section (currently empty because no reviews are featured yet).

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: integrate GoogleReviewsSection into homepage"
```

---

## Task 9: Add TrustPilot Badge to Footer

**Files:**
- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Add TrustPilot badge to footer**

Open `src/components/layout/Footer.tsx` and locate the footer content area. Find a good placement in the footer (typically in the contact/trust section). Add this component:

```typescript
{/* TrustPilot Badge - Add to appropriate footer column */}
<div className="mb-6 flex items-center gap-2">
  <span className="text-sm font-semibold text-gray-900">Trusted on:</span>
  <a
    href="https://www.trustpilot.com/review/ntsltd.co.uk"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
    title="View our reviews on TrustPilot"
  >
    <span className="text-xs font-semibold text-green-600">★★★★★ 4.8/5</span>
    <span className="text-xs text-gray-700">TrustPilot</span>
  </a>
</div>
```

**Note:** Update the TrustPilot URL `https://www.trustpilot.com/review/ntsltd.co.uk` to match your actual TrustPilot profile URL. Also update the rating "4.8/5" to match your actual current rating on TrustPilot.

- [ ] **Step 2: Test footer**

```bash
npm run dev
```

Visit `http://localhost:3000` and scroll to footer. You should see the TrustPilot badge. Click it - it should open your TrustPilot profile in a new tab.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "feat: add TrustPilot badge to footer"
```

---

## Task 10: Add Reviews Link to Admin Navigation

**Files:**
- Modify: `src/app/admin/layout.tsx`

- [ ] **Step 1: Add reviews navigation link**

Open `src/app/admin/layout.tsx` and locate where navigation links are defined (look for links to other admin pages like projects, news, etc.). Add a new link for reviews. Typically they follow a pattern like:

```typescript
{
  label: 'Reviews',
  href: '/admin/reviews',
  icon: '⭐', // or use FaStar
}
```

The exact location and format depends on your current navigation structure. Add it somewhere logical (maybe after Testimonials or at the end).

- [ ] **Step 2: Test navigation**

```bash
npm run dev
```

Visit `http://localhost:3000/admin` and verify the Reviews link appears in the navigation menu.

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/layout.tsx
git commit -m "feat: add Reviews link to admin navigation"
```

---

## Task 11: Seed Initial Google Reviews

**Files:**
- No new files; uses API and admin interface

- [ ] **Step 1: Add initial reviews through admin UI**

```bash
npm run dev
```

Visit `http://localhost:3000/admin/reviews` and click "+ Add Review"

Add three reviews with this data:

**Review 1:**
- Reviewer Name: Martin Omond
- Reviewer Title: Local Guide·381 reviews
- Review Text: Work visit, as usual super easy, friendly staff
- Rating: 5
- Google URL: https://www.google.com/maps/place/NTS+Ltd/@[your-coordinates] (get from your Google Business profile)
- Featured: ✓ Yes
- Order: 0

**Review 2:**
- Reviewer Name: Tom Monkman
- Reviewer Title: 11 reviews·1 photo
- Review Text: Great company and really friendly team
- Rating: 5
- Google URL: (get from your Google Business profile)
- Featured: ✓ Yes
- Order: 1

**Review 3:**
- Reviewer Name: Matthew Gartland
- Reviewer Title: 2 reviews
- Review Text: NT Services provide a good and reliable service
- Rating: 5
- Google URL: (get from your Google Business profile)
- Featured: ✓ Yes
- Order: 2

After adding all three, visit the homepage and scroll down - you should see all three reviews displayed in the new Google Reviews section.

- [ ] **Step 2: Verify everything displays correctly**

- [ ] Check homepage shows 3 reviews in responsive grid
- [ ] Check each review card is clickable and links to Google
- [ ] Check admin list page shows all reviews with featured status
- [ ] Check TrustPilot badge is visible in footer

No commit needed for this step (data is in database, not code).

---

## Task 12: Test & Verify Everything

**Files:**
- No code changes; verification only

- [ ] **Step 1: Test responsive layout**

```bash
npm run dev
```

Test on multiple screen sizes:
- Desktop (1280px) - should show 3 reviews side-by-side
- Tablet (768px) - should show 2 reviews, 3rd below
- Mobile (375px) - should show 1 review full-width

- [ ] **Step 2: Test admin functionality**

Visit `/admin/reviews` and verify:
- [ ] List page loads with all reviews
- [ ] Can click "Add Review" button
- [ ] Form validation works (try submitting empty form)
- [ ] Can edit existing review by clicking the edit icon
- [ ] Can toggle "Featured" checkbox and changes appear on homepage immediately
- [ ] Can change "Order" and homepage updates
- [ ] Can delete review with confirmation

- [ ] **Step 3: Test API endpoints**

```bash
curl http://localhost:3000/api/google-reviews
```

Expected response:
```json
{
  "reviews": [
    {
      "id": 1,
      "reviewerName": "Martin Omond",
      "reviewerTitle": "Local Guide·381 reviews",
      "reviewText": "Work visit, as usual super easy, friendly staff",
      "rating": 5,
      "googleUrl": "...",
      "featured": true,
      "order": 0
    },
    // ...
  ]
}
```

- [ ] **Step 4: Test links**

- [ ] Click review cards on homepage - should open Google Business profile
- [ ] Click "View All Reviews" button - should open Google Business profile
- [ ] Click TrustPilot badge in footer - should open TrustPilot profile

- [ ] **Step 5: Verify no breaking changes**

- [ ] Homepage still loads correctly
- [ ] Testimonials carousel still works
- [ ] Footer displays correctly
- [ ] Admin dashboard still accessible
- [ ] All other admin pages still work

- [ ] **Step 6: Final commit and push**

```bash
git log --oneline -10
# Verify all commits are there

git status
# Should be clean (nothing to commit)

# Push to production
git push origin main
```

Then on production server:

```bash
cd /var/www/ntsltd
git pull
npm run build
pm2 restart nts-website
```

Verify production:
- Visit https://nevilletuckerservices.co.uk
- See Google Reviews section on homepage
- See TrustPilot badge in footer
- Visit admin and verify reviews management works

---

## Success Checklist

✅ GoogleReview Prisma model created  
✅ Database migration runs successfully  
✅ `/api/google-reviews` endpoint returns featured reviews  
✅ `/admin/reviews` list page shows all reviews  
✅ Add/Edit/Delete review functionality works  
✅ GoogleReviewsSection displays on homepage with 3 reviews  
✅ Review cards are clickable and link to Google  
✅ Responsive layout works (desktop, tablet, mobile)  
✅ TrustPilot badge appears in footer  
✅ Admin navigation includes Reviews link  
✅ Initial 3 reviews seeded (Martin, Tom, Matthew)  
✅ No breaking changes to existing functionality  
✅ All changes deployed to production  

---

## Common Issues & Troubleshooting

**Issue:** API returns empty reviews even after adding them
- **Solution:** Make sure reviews have `featured: true` and you're fetching `/api/google-reviews` not admin endpoint

**Issue:** Form submit fails with validation error
- **Solution:** Check all required fields are filled (name, text, rating, URL). Check URL is valid format (starts with http/https)

**Issue:** Homepage doesn't show reviews section
- **Solution:** Check import is added to page.tsx, check featured reviews exist in database, check `/api/google-reviews` returns data

**Issue:** TrustPilot link is wrong URL
- **Solution:** Find your TrustPilot profile URL and update it in Footer.tsx component

---

**End of Implementation Plan**