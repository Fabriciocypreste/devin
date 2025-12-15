-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Content" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tmdbId" INTEGER,
    "title" TEXT NOT NULL,
    "originalTitle" TEXT,
    "type" TEXT NOT NULL DEFAULT 'movie',
    "overview" TEXT,
    "posterPath" TEXT,
    "backdropPath" TEXT,
    "logoPath" TEXT,
    "trailerUrl" TEXT,
    "streamUrl" TEXT,
    "releaseDate" TEXT,
    "runtime" INTEGER,
    "voteAverage" REAL NOT NULL DEFAULT 0,
    "voteCount" INTEGER NOT NULL DEFAULT 0,
    "genres" TEXT,
    "regions" TEXT,
    "plans" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "channelNumber" INTEGER,
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Content" ("active", "backdropPath", "createdAt", "featured", "genres", "id", "logoPath", "order", "originalTitle", "overview", "plans", "posterPath", "regions", "releaseDate", "runtime", "streamUrl", "title", "tmdbId", "trailerUrl", "type", "updatedAt", "voteAverage", "voteCount") SELECT "active", "backdropPath", "createdAt", "featured", "genres", "id", "logoPath", "order", "originalTitle", "overview", "plans", "posterPath", "regions", "releaseDate", "runtime", "streamUrl", "title", "tmdbId", "trailerUrl", "type", "updatedAt", "voteAverage", "voteCount" FROM "Content";
DROP TABLE "Content";
ALTER TABLE "new_Content" RENAME TO "Content";
CREATE UNIQUE INDEX "Content_channelNumber_key" ON "Content"("channelNumber");
CREATE INDEX "Content_type_idx" ON "Content"("type");
CREATE INDEX "Content_featured_idx" ON "Content"("featured");
CREATE INDEX "Content_active_idx" ON "Content"("active");
CREATE INDEX "Content_channelNumber_idx" ON "Content"("channelNumber");
CREATE INDEX "Content_isLive_idx" ON "Content"("isLive");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
