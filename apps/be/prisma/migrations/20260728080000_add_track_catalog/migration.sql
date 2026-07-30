-- CreateEnum
CREATE TYPE "TrackStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "track_catalogs" (
    "id" TEXT NOT NULL,
    "company_id" TEXT,
    "company_member_id" TEXT,
    "user_id" TEXT,
    "title" TEXT NOT NULL,
    "youtube_url" TEXT NOT NULL,
    "youtube_video_id" TEXT NOT NULL,
    "status" "TrackStatus" NOT NULL DEFAULT 'PENDING',
    "rejection_reason" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "track_catalogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "track_catalogs_company_id_youtube_video_id_key" ON "track_catalogs"("company_id", "youtube_video_id");

-- AddForeignKey
ALTER TABLE "track_catalogs" ADD CONSTRAINT "track_catalogs_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "track_catalogs" ADD CONSTRAINT "track_catalogs_company_member_id_fkey" FOREIGN KEY ("company_member_id") REFERENCES "company_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "track_catalogs" ADD CONSTRAINT "track_catalogs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable: Add trackCatalogId to playlist_items
ALTER TABLE "playlist_items" ADD COLUMN "track_catalog_id" TEXT;

-- AddForeignKey: playlist_items -> track_catalogs
ALTER TABLE "playlist_items" ADD CONSTRAINT "playlist_items_track_catalog_id_fkey" FOREIGN KEY ("track_catalog_id") REFERENCES "track_catalogs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
