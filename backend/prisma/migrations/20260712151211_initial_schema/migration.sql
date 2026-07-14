-- CreateEnum
CREATE TYPE "EarnSource" AS ENUM ('TRANSACTION', 'REFERRAL');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('EARN', 'REDEEM', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PromoDiscountType" AS ENUM ('PERCENT', 'FIXED');

-- CreateEnum
CREATE TYPE "PromoTypes" AS ENUM ('PLATFORM', 'ORGANIZER');

-- CreateEnum
CREATE TYPE "SalesOrderStatus" AS ENUM ('WAITING_PAYMENT', 'PAID', 'CANCELLED', 'CANCELLED_EXPIRED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "is_organizer" BOOLEAN NOT NULL,
    "ref_code" TEXT NOT NULL,
    "balance_points" INTEGER NOT NULL DEFAULT 0,
    "refBy" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "nik" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "avatar_url" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "eventTitle" TEXT NOT NULL,
    "event_date" TIMESTAMP(3) NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "event_desc" TEXT NOT NULL,
    "event_img" TEXT NOT NULL,
    "event_tnc" TEXT NOT NULL,
    "last_buy_date" TIMESTAMP(3) NOT NULL,
    "last_buy_time" TIMESTAMP(3) NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "category_id" INTEGER NOT NULL,
    "venue_id" INTEGER NOT NULL,
    "organizer_id" TEXT NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "points_ledger" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "transaction_type" "TransactionType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" "EarnSource" NOT NULL,
    "source_id" TEXT,
    "customer_id" TEXT NOT NULL,

    CONSTRAINT "points_ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "points_buckets" (
    "id" SERIAL NOT NULL,
    "earned" INTEGER NOT NULL,
    "remaining" INTEGER NOT NULL,
    "expired_at" TIMESTAMP(3) NOT NULL,
    "earned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customer_id" TEXT NOT NULL,

    CONSTRAINT "points_buckets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "points_reduction_details" (
    "id" SERIAL NOT NULL,
    "ledger_id" INTEGER NOT NULL,
    "bucket_id" INTEGER NOT NULL,
    "amount_redeemed" INTEGER NOT NULL,

    CONSTRAINT "points_reduction_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupons" (
    "id" SERIAL NOT NULL,
    "coupon_code" TEXT NOT NULL,
    "coupon_tnc" TEXT NOT NULL,
    "is_used" BOOLEAN NOT NULL DEFAULT false,
    "is_redeemed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "promo_id" INTEGER NOT NULL,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promos" (
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

    CONSTRAINT "promos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_promos" (
    "id" SERIAL NOT NULL,
    "event_id" TEXT NOT NULL,
    "promo_id" INTEGER NOT NULL,

    CONSTRAINT "event_promos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "venues" (
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

    CONSTRAINT "venues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_orders" (
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

    CONSTRAINT "sales_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_types" (
    "id" SERIAL NOT NULL,
    "ticketType" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "quota" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "event_id" TEXT NOT NULL,

    CONSTRAINT "ticket_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "issued_tickets" (
    "id" TEXT NOT NULL,
    "ticket_code" TEXT NOT NULL,
    "is_used" BOOLEAN NOT NULL DEFAULT false,
    "used_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "ticket_type_id" INTEGER NOT NULL,
    "sales_order_id" TEXT NOT NULL,

    CONSTRAINT "issued_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "payment_method" TEXT NOT NULL,
    "payment_proof" TEXT NOT NULL,
    "paid_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_ref_code_key" ON "users"("ref_code");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_nik_key" ON "profiles"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "events_eventTitle_key" ON "events"("eventTitle");

-- CreateIndex
CREATE UNIQUE INDEX "events_category_id_key" ON "events"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "events_venue_id_key" ON "events"("venue_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_category_key" ON "categories"("category");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_coupon_code_key" ON "coupons"("coupon_code");

-- CreateIndex
CREATE UNIQUE INDEX "promos_promo_name_key" ON "promos"("promo_name");

-- CreateIndex
CREATE UNIQUE INDEX "sales_orders_payment_id_key" ON "sales_orders"("payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "sales_orders_coupon_id_key" ON "sales_orders"("coupon_id");

-- CreateIndex
CREATE UNIQUE INDEX "issued_tickets_ticket_code_key" ON "issued_tickets"("ticket_code");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_refBy_fkey" FOREIGN KEY ("refBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "points_ledger" ADD CONSTRAINT "points_ledger_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "points_buckets" ADD CONSTRAINT "points_buckets_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "points_reduction_details" ADD CONSTRAINT "points_reduction_details_ledger_id_fkey" FOREIGN KEY ("ledger_id") REFERENCES "points_ledger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "points_reduction_details" ADD CONSTRAINT "points_reduction_details_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "points_buckets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_promo_id_fkey" FOREIGN KEY ("promo_id") REFERENCES "promos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promos" ADD CONSTRAINT "promos_promo_owner_id_fkey" FOREIGN KEY ("promo_owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_promos" ADD CONSTRAINT "event_promos_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_promos" ADD CONSTRAINT "event_promos_promo_id_fkey" FOREIGN KEY ("promo_id") REFERENCES "promos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_orders" ADD CONSTRAINT "sales_orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_orders" ADD CONSTRAINT "sales_orders_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_orders" ADD CONSTRAINT "sales_orders_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_types" ADD CONSTRAINT "ticket_types_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issued_tickets" ADD CONSTRAINT "issued_tickets_ticket_type_id_fkey" FOREIGN KEY ("ticket_type_id") REFERENCES "ticket_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issued_tickets" ADD CONSTRAINT "issued_tickets_sales_order_id_fkey" FOREIGN KEY ("sales_order_id") REFERENCES "sales_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
