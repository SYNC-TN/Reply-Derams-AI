/*
  Warnings:

  - You are about to drop the `advancedOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dreamStory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `option` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `dreamStoryId` on table `Page` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "option_advancedOptionId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "advancedOption";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "dreamStory";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "option";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Option" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "artStyle" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "dreamStoryId" INTEGER NOT NULL,
    CONSTRAINT "Option_dreamStoryId_fkey" FOREIGN KEY ("dreamStoryId") REFERENCES "DreamStory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AdvancedOption" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "theme" TEXT NOT NULL,
    "styleStrength" TEXT NOT NULL,
    "resolution" TEXT NOT NULL,
    "optionId" INTEGER NOT NULL,
    CONSTRAINT "AdvancedOption_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DreamStory" (
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
    "dreamStoryId" INTEGER NOT NULL,
    CONSTRAINT "Page_dreamStoryId_fkey" FOREIGN KEY ("dreamStoryId") REFERENCES "DreamStory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Page" ("createdAt", "dreamStoryId", "id", "image", "nb", "text", "updatedAt") SELECT "createdAt", "dreamStoryId", "id", "image", "nb", "text", "updatedAt" FROM "Page";
DROP TABLE "Page";
ALTER TABLE "new_Page" RENAME TO "Page";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "provider" TEXT
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name", "password", "provider") SELECT "createdAt", "email", "id", "name", "password", "provider" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "AdvancedOption_optionId_key" ON "AdvancedOption"("optionId");
