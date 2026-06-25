/*
  Warnings:

  - You are about to drop the `Accreditation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Application` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DailyStats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GeneralApplication` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `featured` on the `GoogleReview` table. All the data in the column will be lost.
  - You are about to drop the column `googleUrl` on the `GoogleReview` table. All the data in the column will be lost.
  - You are about to drop the column `reviewText` on the `GoogleReview` table. All the data in the column will be lost.
  - You are about to drop the column `reviewerName` on the `GoogleReview` table. All the data in the column will be lost.
  - You are about to drop the column `reviewerTitle` on the `GoogleReview` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `author` on the `Testimonial` table. All the data in the column will be lost.
  - You are about to drop the column `logo` on the `Testimonial` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Testimonial` table. All the data in the column will be lost.
  - You are about to drop the column `quote` on the `Testimonial` table. All the data in the column will be lost.
  - Added the required column `author` to the `GoogleReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `GoogleReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Testimonial` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `Testimonial` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Accreditation_order_idx";

-- DropIndex
DROP INDEX "Application_submittedAt_idx";

-- DropIndex
DROP INDEX "Application_status_idx";

-- DropIndex
DROP INDEX "Application_jobId_idx";

-- DropIndex
DROP INDEX "Application_reference_key";

-- DropIndex
DROP INDEX "DailyStats_date_idx";

-- DropIndex
DROP INDEX "DailyStats_date_key";

-- DropIndex
DROP INDEX "GeneralApplication_submittedAt_idx";

-- DropIndex
DROP INDEX "GeneralApplication_status_idx";

-- DropIndex
DROP INDEX "GeneralApplication_reference_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Accreditation";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Application";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "DailyStats";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GeneralApplication";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GoogleReview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "author" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "imageUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_GoogleReview" ("createdAt", "id", "order", "rating", "updatedAt") SELECT "createdAt", "id", "order", "rating", "updatedAt" FROM "GoogleReview";
DROP TABLE "GoogleReview";
ALTER TABLE "new_GoogleReview" RENAME TO "GoogleReview";
CREATE TABLE "new_Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "employmentType" TEXT NOT NULL,
    "salaryRange" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "closesAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "description" TEXT NOT NULL,
    "responsibilities" TEXT NOT NULL,
    "requirements" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Job" ("closesAt", "createdAt", "department", "description", "employmentType", "experience", "id", "location", "requirements", "responsibilities", "salaryRange", "slug", "status", "title", "updatedAt") SELECT "closesAt", "createdAt", "department", "description", "employmentType", "experience", "id", "location", "requirements", "responsibilities", "salaryRange", "slug", "status", "title", "updatedAt" FROM "Job";
DROP TABLE "Job";
ALTER TABLE "new_Job" RENAME TO "Job";
CREATE UNIQUE INDEX "Job_slug_key" ON "Job"("slug");
CREATE TABLE "new_Testimonial" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "projectId" INTEGER,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Testimonial_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Testimonial" ("company", "createdAt", "featured", "id", "projectId", "published", "updatedAt") SELECT "company", "createdAt", "featured", "id", "projectId", "published", "updatedAt" FROM "Testimonial";
DROP TABLE "Testimonial";
ALTER TABLE "new_Testimonial" RENAME TO "Testimonial";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
