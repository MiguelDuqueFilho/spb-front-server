/*
  Warnings:

  - You are about to alter the column `size` on the `FilesEntity` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FilesEntity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "originalName" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL
);
INSERT INTO "new_FilesEntity" ("bucket", "createdAt", "id", "key", "mimeType", "originalName", "size", "updatedAt", "url") SELECT "bucket", "createdAt", "id", "key", "mimeType", "originalName", "size", "updatedAt", "url" FROM "FilesEntity";
DROP TABLE "FilesEntity";
ALTER TABLE "new_FilesEntity" RENAME TO "FilesEntity";
CREATE UNIQUE INDEX "FilesEntity_key_key" ON "FilesEntity"("key");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
