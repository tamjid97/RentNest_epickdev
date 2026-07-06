-- AlterTable
ALTER TABLE "Property" ALTER COLUMN "amenities" DROP NOT NULL,
ALTER COLUMN "amenities" SET DATA TYPE TEXT;
