/*
  Warnings:

  - You are about to drop the `bookmarks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "bookmarks";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Services" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "service" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "domain" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Events" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "codEvent" TEXT NOT NULL,
    "eventName" TEXT,
    "flow" TEXT NOT NULL,
    "serviceId" INTEGER,
    "isConvert" BOOLEAN NOT NULL DEFAULT false,
    "eventJson" TEXT NOT NULL DEFAULT '[]',
    CONSTRAINT "Events_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Services" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "codMsg" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "origenEntity" TEXT NOT NULL,
    "destinationEntity" TEXT NOT NULL,
    "codEventId" TEXT NOT NULL,
    CONSTRAINT "Messages_codEventId_fkey" FOREIGN KEY ("codEventId") REFERENCES "Events" ("codEvent") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MessagesCreated" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "codMsg" TEXT NOT NULL,
    "xmlMessage" TEXT NOT NULL,
    "process" TEXT NOT NULL DEFAULT 'PENDING',
    "status" TEXT NOT NULL DEFAULT 'VALIDATED',
    "error" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Services_service_key" ON "Services"("service");

-- CreateIndex
CREATE UNIQUE INDEX "Events_codEvent_key" ON "Events"("codEvent");

-- CreateIndex
CREATE UNIQUE INDEX "Messages_codMsg_key" ON "Messages"("codMsg");
