/*
  Warnings:

  - A unique constraint covering the columns `[venue_name]` on the table `venue` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "venue_venue_name_key" ON "venue"("venue_name");
