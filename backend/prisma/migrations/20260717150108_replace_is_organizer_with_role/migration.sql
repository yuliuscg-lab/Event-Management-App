/*
  Warnings:

  - You are about to drop the column `is_organizer` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'ORGANIZER', 'ADMIN');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "is_organizer",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CUSTOMER';
