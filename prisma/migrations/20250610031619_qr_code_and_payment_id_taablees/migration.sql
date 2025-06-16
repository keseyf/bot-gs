/*
  Warnings:

  - Added the required column `paymentId` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qrCode` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "paymentId" TEXT NOT NULL,
ADD COLUMN     "qrCode" TEXT NOT NULL;
