-- AlterTable (additive only, v0.0.1 kill switch)
-- Company suspend/activate: status + suspendedAt. No data touched.
CREATE TYPE "CompanyStatus" AS ENUM ('active', 'suspended');
ALTER TABLE "companies" ADD COLUMN "status" "CompanyStatus" NOT NULL DEFAULT 'active';
ALTER TABLE "companies" ADD COLUMN "suspended_at" TIMESTAMP(3);

-- Repair drift: kolom `country` hilang di DB (migrasi contry yang hilang),
-- schema.prisma butuh. Additive, nullable, tanpa sentuh data.
ALTER TABLE "companies" ADD COLUMN "country" TEXT;
