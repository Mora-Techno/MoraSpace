-- DropForeignKey
ALTER TABLE "calendar_events" DROP CONSTRAINT "calendar_events_created_by_fkey";

-- AlterTable
ALTER TABLE "calendar_events" ADD COLUMN     "user_id" TEXT,
ALTER COLUMN "company_id" DROP NOT NULL,
ALTER COLUMN "created_by" DROP NOT NULL;

-- AlterTable
ALTER TABLE "notes" ADD COLUMN     "user_id" TEXT,
ALTER COLUMN "company_member_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "user_id" TEXT,
ALTER COLUMN "company_id" DROP NOT NULL,
ALTER COLUMN "company_member_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "playlists" ADD COLUMN     "user_id" TEXT,
ALTER COLUMN "company_member_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "pomodoro_sessions" ADD COLUMN     "user_id" TEXT,
ALTER COLUMN "company_member_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "todos" ADD COLUMN     "user_id" TEXT,
ALTER COLUMN "company_member_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "company_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pomodoro_sessions" ADD CONSTRAINT "pomodoro_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlists" ADD CONSTRAINT "playlists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
