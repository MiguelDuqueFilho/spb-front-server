/*
  Warnings:

  - You are about to drop the `MessagesCreated` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "MessagesCreated";

-- CreateTable
CREATE TABLE "NewMessages" (
    "id" SERIAL NOT NULL,
    "codMsg" VARCHAR(15) NOT NULL,
    "xmlMessage" XML NOT NULL,
    "process" TEXT NOT NULL DEFAULT 'PENDING',
    "status" TEXT NOT NULL DEFAULT 'VALIDATED',
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewMessages_pkey" PRIMARY KEY ("id")
);
