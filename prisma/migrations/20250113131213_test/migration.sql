-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "provider" TEXT
);

-- CreateTable
CREATE TABLE "Page" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nb" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "dreamStoryId" INTEGER,
    CONSTRAINT "Page_dreamStoryId_fkey" FOREIGN KEY ("dreamStoryId") REFERENCES "DreamStory" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AdvancedOption" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "theme" TEXT NOT NULL,
    "styleStrength" TEXT NOT NULL,
    "resolution" TEXT NOT NULL,
    "optionId" INTEGER,
    CONSTRAINT "AdvancedOption_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Option" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "artStyle" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "dreamStoryId" INTEGER,
    CONSTRAINT "Option_dreamStoryId_fkey" FOREIGN KEY ("dreamStoryId") REFERENCES "DreamStory" ("id") ON DELETE SET NULL ON UPDATE CASCADE
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

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
