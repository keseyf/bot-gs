/*
  Warnings:

  - You are about to drop the column `itemId` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the `Cards` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `itemName` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_itemId_fkey";

-- AlterTable
ALTER TABLE "Orders" DROP COLUMN "itemId",
ADD COLUMN     "itemName" TEXT NOT NULL;

-- DropTable
DROP TABLE "Cards";
