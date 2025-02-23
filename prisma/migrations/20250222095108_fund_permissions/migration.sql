/*
  Warnings:

  - You are about to drop the column `collected` on the `Auction` table. All the data in the column will be lost.
  - You are about to drop the column `groupId` on the `Auction` table. All the data in the column will be lost.
  - You are about to drop the column `noOffersYet` on the `Auction` table. All the data in the column will be lost.
  - Added the required column `fundraisingId` to the `Auction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fundraisingId` to the `FbUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fundraisingId` to the `Stats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Auction" DROP COLUMN "collected",
DROP COLUMN "groupId",
DROP COLUMN "noOffersYet",
ADD COLUMN     "fundraisingId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FbUser" ADD COLUMN     "fundraisingId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Stats" ADD COLUMN     "fundraisingId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Fundraising" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Fundraising_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FundraisingPermissions" (
    "id" TEXT NOT NULL,
    "fundraisingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "FundraisingPermissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Texts" (
    "id" TEXT NOT NULL,
    "type" TEXT,
    "text" TEXT NOT NULL,

    CONSTRAINT "Texts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Fundraising_name_key" ON "Fundraising"("name");

-- AddForeignKey
ALTER TABLE "FundraisingPermissions" ADD CONSTRAINT "FundraisingPermissions_fundraisingId_fkey" FOREIGN KEY ("fundraisingId") REFERENCES "Fundraising"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundraisingPermissions" ADD CONSTRAINT "FundraisingPermissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_fundraisingId_fkey" FOREIGN KEY ("fundraisingId") REFERENCES "Fundraising"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FbUser" ADD CONSTRAINT "FbUser_fundraisingId_fkey" FOREIGN KEY ("fundraisingId") REFERENCES "Fundraising"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stats" ADD CONSTRAINT "Stats_fundraisingId_fkey" FOREIGN KEY ("fundraisingId") REFERENCES "Fundraising"("id") ON DELETE CASCADE ON UPDATE CASCADE;
