-- Add status column to Career table
ALTER TABLE "Career" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'draft';

-- Add published column to Project table
ALTER TABLE "Project" ADD COLUMN "published" BOOLEAN NOT NULL DEFAULT false;

-- Add published column to Testimonial table
ALTER TABLE "Testimonial" ADD COLUMN "published" BOOLEAN NOT NULL DEFAULT false;

-- Add published column to News table
ALTER TABLE "News" ADD COLUMN "published" BOOLEAN NOT NULL DEFAULT false;
