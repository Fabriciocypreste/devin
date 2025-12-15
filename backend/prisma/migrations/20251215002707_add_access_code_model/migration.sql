-- CreateTable
CREATE TABLE "AccessCode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "userId" INTEGER,
    "email" TEXT,
    "expiresAt" DATETIME NOT NULL,
    "usedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdBy" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AccessCode_code_key" ON "AccessCode"("code");

-- CreateIndex
CREATE INDEX "AccessCode_code_idx" ON "AccessCode"("code");

-- CreateIndex
CREATE INDEX "AccessCode_status_idx" ON "AccessCode"("status");

-- CreateIndex
CREATE INDEX "AccessCode_expiresAt_idx" ON "AccessCode"("expiresAt");
