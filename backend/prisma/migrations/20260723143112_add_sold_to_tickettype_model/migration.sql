/*
  Warnings:

  - Added the required column `sold` to the `ticket_types` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ticket_types" ADD COLUMN     "sold" INTEGER NOT NULL;
