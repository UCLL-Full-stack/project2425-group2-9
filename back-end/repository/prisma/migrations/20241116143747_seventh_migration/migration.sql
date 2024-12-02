-- DropIndex
DROP INDEX "CartContainsProduct_productName_key";

-- AlterTable
ALTER TABLE "CartContainsProduct" ADD CONSTRAINT "CartContainsProduct_pkey" PRIMARY KEY ("cartId", "productName");
