-- Rename columns and add new fields to Testimonial
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_Testimonial" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quote" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "company" TEXT,
    "logo" TEXT,
    "projectId" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Testimonial_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

INSERT INTO "new_Testimonial" ("id", "quote", "author", "company", "logo", "projectId", "order", "featured", "createdAt", "updatedAt")
SELECT "id", "text", "name", "company", NULL, "projectId", 0, "featured", "createdAt", "updatedAt" FROM "Testimonial";

DROP TABLE "Testimonial";

ALTER TABLE "new_Testimonial" RENAME TO "Testimonial";

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
