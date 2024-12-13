/*
  Warnings:

  - You are about to drop the column `securityQuestion` on the `Customer` table. All the data in the column will be lost.
  - Added the required column `role` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('GUEST', 'ADMIN', 'CUSTOMER');

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "securityQuestion",
ADD COLUMN     "role" "Role" NOT NULL;
