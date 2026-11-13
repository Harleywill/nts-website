-- Create DailyStats model for tracking 30-day history
CREATE TABLE "DailyStats" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL UNIQUE,
    "userCount" INTEGER NOT NULL DEFAULT 0,
    "projectCount" INTEGER NOT NULL DEFAULT 0,
    "newsCount" INTEGER NOT NULL DEFAULT 0,
    "testimonialCount" INTEGER NOT NULL DEFAULT 0,
    "contactSubmissionCount" INTEGER NOT NULL DEFAULT 0,
    "applicationCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "DailyStats_date_idx" ON "DailyStats"("date");
