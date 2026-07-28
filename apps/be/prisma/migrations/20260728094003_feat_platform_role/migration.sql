-- CreateEnum
CREATE TYPE "PlatformRole" AS ENUM ('USER', 'DEVELOPER', 'SUPER_ADMIN');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "platform_role" "PlatformRole" NOT NULL DEFAULT 'USER';
