/*
  Warnings:

  - Added the required column `created_At` to the `notification_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notification_logs" ADD COLUMN     "created_At" TIMESTAMP(3) NOT NULL;
