/*
  Warnings:

  - You are about to drop the `coupons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `points_buckets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `promos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sales_orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ticket_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `venues` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "coupons" DROP CONSTRAINT "coupons_promo_id_fkey";

-- DropForeignKey
ALTER TABLE "event_promos" DROP CONSTRAINT "event_promos_promo_id_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_venue_id_fkey";

-- DropForeignKey
ALTER TABLE "issued_tickets" DROP CONSTRAINT "issued_tickets_sales_order_id_fkey";

-- DropForeignKey
ALTER TABLE "issued_tickets" DROP CONSTRAINT "issued_tickets_ticket_type_id_fkey";

-- DropForeignKey
ALTER TABLE "points_buckets" DROP CONSTRAINT "points_buckets_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "points_deduction_details" DROP CONSTRAINT "points_deduction_details_bucket_id_fkey";

-- DropForeignKey
ALTER TABLE "promos" DROP CONSTRAINT "promos_promo_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "sales_orders" DROP CONSTRAINT "sales_orders_coupon_id_fkey";

-- DropForeignKey
ALTER TABLE "sales_orders" DROP CONSTRAINT "sales_orders_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "sales_orders" DROP CONSTRAINT "sales_orders_payment_id_fkey";

-- DropForeignKey
ALTER TABLE "ticket_types" DROP CONSTRAINT "ticket_types_event_id_fkey";

-- DropTable
DROP TABLE "coupons";

-- DropTable
DROP TABLE "points_buckets";

-- DropTable
DROP TABLE "promos";

-- DropTable
DROP TABLE "sales_orders";

-- DropTable
DROP TABLE "ticket_types";

-- DropTable
DROP TABLE "venues";

-- CreateTable
CREATE TABLE "points_bucket" (
    "id" SERIAL NOT NULL,
    "earned" INTEGER NOT NULL,
    "remaining" INTEGER NOT NULL,
    "expired_at" TIMESTAMP(3) NOT NULL,
    "earned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customer_id" TEXT NOT NULL,

    CONSTRAINT "points_bucket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupon" (
    "id" SERIAL NOT NULL,
    "coupon_code" TEXT NOT NULL,
    "coupon_tnc" TEXT NOT NULL,
    "is_used" BOOLEAN NOT NULL DEFAULT false,
    "is_redeemed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "promo_id" INTEGER NOT NULL,

    CONSTRAINT "coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promo" (
    "id" SERIAL NOT NULL,
    "promo_type" "PromoTypes" NOT NULL,
    "promo_name" TEXT NOT NULL,
    "promo_tnc" TEXT NOT NULL,
    "discount_type" "PromoDiscountType" NOT NULL,
    "discount_value" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "promo_owner_id" TEXT NOT NULL,

    CONSTRAINT "promo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "venue" (
    "id" SERIAL NOT NULL,
    "venue_name" TEXT NOT NULL,
    "venue_address" TEXT NOT NULL,
    "venue_city" TEXT NOT NULL,
    "venue_state" TEXT NOT NULL,
    "venue_zip_code" TEXT NOT NULL,
    "venue_phone" TEXT NOT NULL,
    "venue_email" TEXT NOT NULL,
    "venue_gmaps_url" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "venue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_order" (
    "id" TEXT NOT NULL,
    "total_price" INTEGER NOT NULL,
    "qty_tickets" INTEGER NOT NULL,
    "discounts" INTEGER NOT NULL,
    "final_price" INTEGER NOT NULL,
    "points_used" INTEGER NOT NULL,
    "status" "SalesOrderStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "customer_id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "coupon_id" INTEGER NOT NULL,

    CONSTRAINT "sales_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_type" (
    "id" SERIAL NOT NULL,
    "ticketType" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "quota" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "event_id" TEXT NOT NULL,

    CONSTRAINT "ticket_type_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "coupon_coupon_code_key" ON "coupon"("coupon_code");

-- CreateIndex
CREATE UNIQUE INDEX "promo_promo_name_key" ON "promo"("promo_name");

-- CreateIndex
CREATE UNIQUE INDEX "sales_order_payment_id_key" ON "sales_order"("payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "sales_order_coupon_id_key" ON "sales_order"("coupon_id");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "points_bucket" ADD CONSTRAINT "points_bucket_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "points_deduction_details" ADD CONSTRAINT "points_deduction_details_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "points_bucket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon" ADD CONSTRAINT "coupon_promo_id_fkey" FOREIGN KEY ("promo_id") REFERENCES "promo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promo" ADD CONSTRAINT "promo_promo_owner_id_fkey" FOREIGN KEY ("promo_owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_promos" ADD CONSTRAINT "event_promos_promo_id_fkey" FOREIGN KEY ("promo_id") REFERENCES "promo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_order" ADD CONSTRAINT "sales_order_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_order" ADD CONSTRAINT "sales_order_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_order" ADD CONSTRAINT "sales_order_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_type" ADD CONSTRAINT "ticket_type_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issued_tickets" ADD CONSTRAINT "issued_tickets_sales_order_id_fkey" FOREIGN KEY ("sales_order_id") REFERENCES "sales_order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issued_tickets" ADD CONSTRAINT "issued_tickets_ticket_type_id_fkey" FOREIGN KEY ("ticket_type_id") REFERENCES "ticket_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
