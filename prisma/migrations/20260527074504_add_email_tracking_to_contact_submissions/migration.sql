/*
  Warnings:

  - Added the required column `updatedAt` to the `ContactSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ContactSubmission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "service" TEXT,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "emailSentToAdmin" BOOLEAN NOT NULL DEFAULT false,
    "emailSentToUser" BOOLEAN NOT NULL DEFAULT false,
    "adminEmails" TEXT,
    "userEmail" TEXT,
    "emailError" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ContactSubmission" ("createdAt", "email", "id", "message", "name", "phone", "read", "service") SELECT "createdAt", "email", "id", "message", "name", "phone", "read", "service" FROM "ContactSubmission";
DROP TABLE "ContactSubmission";
ALTER TABLE "new_ContactSubmission" RENAME TO "ContactSubmission";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
