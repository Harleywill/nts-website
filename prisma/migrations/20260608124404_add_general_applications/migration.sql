-- CreateTable
CREATE TABLE "GeneralApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reference" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "desiredRole" TEXT,
    "skills" TEXT,
    "experience" TEXT,
    "message" TEXT,
    "cvUrl" TEXT NOT NULL,
    "cvFilename" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "notes" TEXT,
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "GeneralApplication_reference_key" ON "GeneralApplication"("reference");

-- CreateIndex
CREATE INDEX "GeneralApplication_status_idx" ON "GeneralApplication"("status");

-- CreateIndex
CREATE INDEX "GeneralApplication_submittedAt_idx" ON "GeneralApplication"("submittedAt");
