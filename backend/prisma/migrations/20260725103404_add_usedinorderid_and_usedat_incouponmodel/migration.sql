-- AlterTable
ALTER TABLE "coupons" ADD COLUMN     "used_at" TIMESTAMP(3),
ADD COLUMN     "used_in_order_id" TEXT;
