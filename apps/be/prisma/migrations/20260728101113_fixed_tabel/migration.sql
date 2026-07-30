/*
  Warnings:

  - You are about to drop the column `title` on the `playlist_items` table. All the data in the column will be lost.
  - You are about to drop the column `youtube_url` on the `playlist_items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "playlist_items" DROP COLUMN "title",
DROP COLUMN "youtube_url";
