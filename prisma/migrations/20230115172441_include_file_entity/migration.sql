/*
  Warnings:

  - You are about to drop the column `fileName` on the `FilesEntity` table. All the data in the column will be lost.
  - You are about to drop the column `fileUrl` on the `FilesEntity` table. All the data in the column will be lost.
  - Added the required column `bucket` to the `FilesEntity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimeType` to the `FilesEntity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalName` to the `FilesEntity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `FilesEntity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `FilesEntity` table without a default value. This is not possible if the table is not empty.

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
    "size" TEXT NOT NULL,
    "url" TEXT NOT NULL
);
INSERT INTO "new_FilesEntity" ("createdAt", "id", "key", "updatedAt") SELECT "createdAt", "id", "key", "updatedAt" FROM "FilesEntity";
DROP TABLE "FilesEntity";
ALTER TABLE "new_FilesEntity" RENAME TO "FilesEntity";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
