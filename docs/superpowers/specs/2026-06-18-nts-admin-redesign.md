# NTS Admin Redesign: MEPM-Style Admin CMS

**Date:** 2026-06-18  
**Project:** NTS Ltd Website Redesign  
**Scope:** Full admin interface visual redesign and feature reorganization to match MEPM admin CMS  
**Status:** Design Approved

---

## Overview

Redesign the NTS admin panel to match the MEPM admin CMS design system. This includes migrating from a top-navbar layout to a left-sidebar layout, applying MEPM's visual design system, implementing role-based access control, and reorganizing navigation to align with MEPM's structure where applicable.

---

## Current State

- **Layout:** Horizontal top navbar navigation
- **Navigation:** Dashboard, Projects, Testimonials, News, Users, Contact Submissions, Settings, Careers, Email Log
- **Styling:** Basic Tailwind CSS, not using unified design system
- **Permissions:** Simple auth, no role-based granular control
- **Components:** Basic panels and pills, no unified component system

---

## Target State

- **Layout:** Sticky left sidebar (252px), main content area with header
- **Navigation:** Reorganized into semantic groups with icon-based navigation
- **Styling:** MEPM design system (navy sidebar, green accents, professional typography)
- **Permissions:** Role-based access control (Administrator, Editor, Viewer)
- **Components:** MEPM-style cards, grids, status badges, featured toggles

---

## Design System

### Colors
- **Sidebar Background:** Navy (#1a2f6e)
- **Sidebar Text:** White
- **CTA Buttons:** Green (#68B830)
- **Accents:** Same as MEPM (red for destructive actions, etc.)
- **Backgrounds:** Light slate/white for content areas

### Typography
- **Font Family:** Inter (via next/font)
- **Display Font:** Same as MEPM (--font-display)
- **Mono Font:** Same as MEPM (--font-mono)
- **Body Font:** Same as MEPM (--font-body)

### Spacing & Layout
- **Grid:** 8px base unit
- **Sidebar Width:** 252px (sticky)
- **Content Padding:** 36px
- **Max Content Width:** 1140px

### Icons
- **Library:** Lucide React
- **Naming:** PascalCase (e.g., `LayoutDashboard`, `FolderKanban`)
- **Stroke Width:** 1.9

---

## Navigation Structure

### Sidebar Layout
- **Logo Section:** NTS logo (white), centered at top with border separator
- **Navigation Groups:**
  1. **Overview**
     - Dashboard (LayoutDashboard)
  2. **Content**
     - Projects (FolderKanban)
     - Enquiries (Inbox) ← formerly "Contact Submissions"
     - Blog/Posts (FileText) ← formerly "News"
     - Testimonials (Quote)
  3. **Management**
     - Team Members (Users) ← formerly "Users"
     - Settings (Settings)
  4. **System** (optional, keep if needed)
     - Careers (Briefcase)
     - Email Log (Mail)

### Navigation Styling
- **Active State:** Green background (#68B830) with green left border (3px, 3px radius)
- **Icon Color:** Green when active, white/60% opacity when inactive
- **Font Weight:** 600 when active, 500 when inactive
- **Hover State:** Light white overlay (6% opacity)
- **Item Padding:** 10px 12px
- **Group Label:** Uppercase, small mono font, 34% opacity, letter-spacing

### User Profile (Bottom of Sidebar)
- **Layout:** Avatar icon (36px circle) + username + role badge
- **Border:** Top border separator
- **Padding:** 14px 12px
- **Avatar Background:** Light overlay (10% opacity)
- **Username:** Bold, white, 13px
- **Role:** Mono font, small, uppercase, 50% opacity, capitalized

### Header (Top of Main Content)
- **Left Side:** Breadcrumbs (mono font, 12px)
  - Format: "NTS > Dashboard > Projects" (ChevronRight separators)
  - Colors: First item navy, active item slate-700, inactive items slate-500
- **Right Side:** 
  - "View live site" button (with ExternalLink icon)
  - "SAVED LOCALLY" status badge (green background, green dot)

---

## Page Structures

### Dashboard
**Purpose:** Overview of site content and recent activity

**Components:**
- **Stat Cards:** 4-column grid (responsive)
  - Published Projects count
  - Draft Projects count
  - New Enquiries count
  - Team Members count
- **Recently Updated Section:** List of recently modified projects/content
- **Featured Homepage Section:** Display of featured content items
- **Activity Feed:** Recent actions (optional, if NTS needs this)

**Styling:**
- Cards: White background, border, hover shadow
- Stat Value: Large display font, navy text
- Stat Label: Small mono font, uppercase, slate-500

---

### Projects
**Purpose:** Manage service/portfolio projects

**Layout:** 3-column responsive card grid

**Card Content:**
- Hero image or placeholder
- Project title
- Status badge (Draft/Published)
- Description excerpt
- Edit (pencil) + Delete (trash) buttons

**Permissions:**
- Show buttons only if user is Administrator or Editor
- Delete requires confirmation dialog

**Filtering/Sorting:**
- Search bar
- Status filter (Draft/Published)
- Sort by date modified

---

### Enquiries (formerly Contact Submissions)
**Purpose:** Inbox-style management of contact form submissions

**Layout:** Two-column split
- **Left Column:** List of enquiries
  - Green dot indicator for new/unread
  - Enquiry date, name, service type
  - Auto-mark as read on click
- **Right Column:** Detail panel
  - Full enquiry details (name, email, phone, message, service)
  - Action buttons: Reply, Mark Replied, Mark Unread, Delete
  - Delete confirmation dialog

**Styling:** Similar to MEPM enquiries page

---

### Blog/Posts (formerly News)
**Purpose:** Manage blog articles and news posts

**Layout:** Responsive card grid (3 columns, stacking on mobile)

**Card Content:**
- Thumbnail/featured image
- Title
- Excerpt
- Date published
- Status badge (Draft/Published)
- Edit + Delete buttons

**Permissions:**
- Show buttons only if user is Administrator or Editor
- Delete requires confirmation dialog

---

### Testimonials
**Purpose:** Manage client testimonials

**Layout:** 2-column responsive grid

**Card Content:**
- Green quote icon at top
- Green 3px top border
- Quote text
- Divider line
- Author name + company
- Edit + Delete buttons

---

### Team Members (formerly Users)
**Purpose:** Manage team member profiles

**Layout:** Responsive card grid

**Card Content:**
- Profile photo or avatar placeholder
- Name (title)
- Role/Job Title
- Discipline badge (Electrical/Mechanical/Environmental with colors)
- Edit + Delete buttons

**Edit Form:**
- Photo upload with drag-drop preview
- Name field
- Role field (disabled for non-Administrators with "Admin only" badge)
- Discipline dropdown
- Bio/Description textarea
- Save/Cancel buttons

**Permissions:**
- All users can view
- Only Administrator and Editor can edit/delete
- Only Administrator can change role field

---

### Settings
**Purpose:** Manage site configuration

**Sections:**
- **Content Overview:** Count of Projects, Posts, Enquiries, Team Members, Testimonials
- **Export:** Download all content as JSON
- **Reset Data:** Clear and restore sample data (confirmation required)
- **Contact Details:** Phone, email, address lines
- **Social Links:** Facebook, X/Twitter, Instagram, LinkedIn

---

## Permissions System

### Role Definitions
- **Administrator:** Full access (create, edit, delete, publish, manage roles, system settings)
- **Editor:** Can create, edit, delete content (projects, posts, testimonials, team) but cannot manage users or change roles
- **Viewer:** Read-only access to all content

### Implementation
- **Frontend:** Fetch user role from `/api/auth/me`, conditionally show/hide action buttons
- **Backend:** Validate permissions on every API call (create, update, delete)
- **Role Field:** Only Administrators can create/edit team member roles

### Button Visibility
- **Edit Button:** Show for Admin + Editor
- **Delete Button:** Show for Admin + Editor
- **Add/Create Button:** Show for Admin + Editor
- **Role Field:** Disabled for non-Admin users (show lock icon + "Admin only" badge)

---

## Component Reuse from MEPM

The following components/patterns should be adapted from MEPM to NTS:

1. **Sidebar Layout** (`/app/admin/layout.tsx`)
   - Sticky navigation, user profile, breadcrumbs
2. **Stat Cards** (Dashboard)
3. **Card Grids** (Projects, Testimonials, Team)
4. **Two-Column Inbox Layout** (Enquiries)
5. **Status Badges** (Draft/Published)
6. **Permission Checks** (role-based visibility)
7. **Icon System** (Lucide React, PascalCase)
8. **Form Components** (text inputs, textareas, selects, file upload)

---

## Data Structure Mapping

| Current (NTS) | New (NTS + MEPM-style) | MEPM Equivalent |
|---------------|------------------------|-----------------|
| Users | Team Members | Team |
| News | Blog/Posts | (not in MEPM, but similar to Projects/Blog concept) |
| Contact Submissions | Enquiries | Enquiries |
| Projects | Projects | Projects |
| Testimonials | Testimonials | Testimonials |
| Settings | Settings | Settings |
| Careers | Careers (optional) | (not in MEPM) |
| Email Log | Email Log (optional) | (not in MEPM) |

---

## Success Criteria

- ✅ Admin sidebar matches MEPM's visual design and layout
- ✅ All navigation pages are reorganized and relabeled
- ✅ Dashboard displays stat cards and recent items (MEPM-style)
- ✅ Permission system is working (buttons hidden for Viewers, role field locked for non-Admins)
- ✅ All pages use responsive card grids or appropriate layouts
- ✅ Breadcrumbs display correctly on all pages
- ✅ "View live site" button present on all pages
- ✅ User profile shows in sidebar with role
- ✅ Delete operations show confirmation dialogs
- ✅ Visual consistency with MEPM throughout (colors, typography, spacing)

---

## Notes

- Use existing NTS data models where possible (don't restructure database)
- Adapt MEPM components, but customize for NTS content types
- Maintain all current NTS functionality (no feature removal)
- Apply MEPM's Lucide React icon system throughout
- Follow MEPM's CSS variable system for colors and typography
