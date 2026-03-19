/*
  Warnings:

  - Added the required column `unitPrice` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "unitPrice" DECIMAL(65,30) NOT NULL,
ALTER COLUMN "totalPrice" SET DATA TYPE DECIMAL(65,30);
