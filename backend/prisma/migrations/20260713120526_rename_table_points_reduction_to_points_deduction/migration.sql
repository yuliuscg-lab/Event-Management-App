/*
  Warnings:

  - You are about to drop the `points_reduction_details` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "points_reduction_details" DROP CONSTRAINT "points_reduction_details_bucket_id_fkey";

-- DropForeignKey
ALTER TABLE "points_reduction_details" DROP CONSTRAINT "points_reduction_details_ledger_id_fkey";

-- DropTable
DROP TABLE "points_reduction_details";

-- CreateTable
CREATE TABLE "points_deduction_details" (
    "id" SERIAL NOT NULL,
    "ledger_id" INTEGER NOT NULL,
    "bucket_id" INTEGER NOT NULL,
    "amount_redeemed" INTEGER NOT NULL,

    CONSTRAINT "points_deduction_details_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "points_deduction_details" ADD CONSTRAINT "points_deduction_details_ledger_id_fkey" FOREIGN KEY ("ledger_id") REFERENCES "points_ledger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "points_deduction_details" ADD CONSTRAINT "points_deduction_details_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "points_buckets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
