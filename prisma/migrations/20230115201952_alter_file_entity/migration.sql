/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `FilesEntity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FilesEntity_key_key" ON "FilesEntity"("key");
