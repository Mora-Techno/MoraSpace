/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `user_settings` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user_settings" ADD COLUMN     "user_id" TEXT,
ALTER COLUMN "company_member_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_user_id_key" ON "user_settings"("user_id");

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
