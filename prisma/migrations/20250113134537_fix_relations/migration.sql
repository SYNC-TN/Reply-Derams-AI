/*
  Warnings:

  - You are about to drop the `AdvancedOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DreamStory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Option` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AdvancedOption";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "DreamStory";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Option";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "option" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "artStyle" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "advancedOptionId" INTEGER,
    "dreamStoryId" INTEGER,
    CONSTRAINT "option_advancedOptionId_fkey" FOREIGN KEY ("advancedOptionId") REFERENCES "advancedOption" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "option_dreamStoryId_fkey" FOREIGN KEY ("dreamStoryId") REFERENCES "dreamStory" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "advancedOption" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "theme" TEXT NOT NULL,
    "styleStrength" TEXT NOT NULL,
    "resolution" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "dreamStory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Page" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nb" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "dreamStoryId" INTEGER,
    CONSTRAINT "Page_dreamStoryId_fkey" FOREIGN KEY ("dreamStoryId") REFERENCES "dreamStory" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Page" ("createdAt", "dreamStoryId", "id", "image", "nb", "text", "updatedAt") SELECT "createdAt", "dreamStoryId", "id", "image", "nb", "text", "updatedAt" FROM "Page";
DROP TABLE "Page";
ALTER TABLE "new_Page" RENAME TO "Page";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "option_advancedOptionId_key" ON "option"("advancedOptionId");
