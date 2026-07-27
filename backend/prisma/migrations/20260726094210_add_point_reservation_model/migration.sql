-- CreateTable
CREATE TABLE "points_reservations" (
    "id" SERIAL NOT NULL,
    "bucket_id" INTEGER NOT NULL,
    "sales_order_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "points_reservations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "points_reservations_sales_order_id_idx" ON "points_reservations"("sales_order_id");

-- CreateIndex
CREATE INDEX "points_reservations_bucket_id_idx" ON "points_reservations"("bucket_id");

-- AddForeignKey
ALTER TABLE "points_reservations" ADD CONSTRAINT "points_reservations_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "points_buckets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "points_reservations" ADD CONSTRAINT "points_reservations_sales_order_id_fkey" FOREIGN KEY ("sales_order_id") REFERENCES "sales_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
