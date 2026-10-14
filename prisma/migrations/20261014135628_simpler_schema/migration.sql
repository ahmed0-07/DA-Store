/*
  Warnings:

  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_images` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[transaction_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_order_id_fkey";

-- DropForeignKey
ALTER TABLE "product_images" DROP CONSTRAINT "product_images_product_id_fkey";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "payment_provider" VARCHAR(50),
ADD COLUMN     "payment_status" "PaymentStatus" NOT NULL DEFAULT 'pending',
ADD COLUMN     "transaction_id" VARCHAR(255);

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "image_url" TEXT;

-- DropTable
DROP TABLE "payments";

-- DropTable
DROP TABLE "product_images";

-- CreateIndex
CREATE UNIQUE INDEX "orders_transaction_id_key" ON "orders"("transaction_id");
