-- CreateEnum
CREATE TYPE "MetricEventType" AS ENUM ('MESSAGE_SENT_OUT_OF_HOURS', 'URGENT_BUTTON_USED', 'WORKING_STATUS_VIEWED', 'APP_OPENED_OUT_OF_HOURS');

-- AlterTable
ALTER TABLE "company_policies" ADD COLUMN "urgent_message_limit_per_day" INTEGER NOT NULL DEFAULT 3;

-- AlterTable
ALTER TABLE "messages" ADD COLUMN "is_held" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "is_urgent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "scheduled_deliver_at" TIMESTAMP(3),
ADD COLUMN "delivered_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "urgent_quota_usages" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "company_member_id" TEXT NOT NULL,
    "usage_date" DATE NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "urgent_quota_usages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metric_events" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "company_member_id" TEXT,
    "event_type" "MetricEventType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metric_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "urgent_quota_usages_company_member_id_usage_date_key" ON "urgent_quota_usages"("company_member_id", "usage_date");

-- CreateIndex
CREATE INDEX "urgent_quota_usages_company_id_usage_date_idx" ON "urgent_quota_usages"("company_id", "usage_date");

-- CreateIndex
CREATE INDEX "metric_events_company_id_event_type_created_at_idx" ON "metric_events"("company_id", "event_type", "created_at");

-- CreateIndex
CREATE INDEX "messages_conversation_id_is_held_scheduled_deliver_at_idx" ON "messages"("conversation_id", "is_held", "scheduled_deliver_at");

-- AddForeignKey
ALTER TABLE "urgent_quota_usages" ADD CONSTRAINT "urgent_quota_usages_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "urgent_quota_usages" ADD CONSTRAINT "urgent_quota_usages_company_member_id_fkey" FOREIGN KEY ("company_member_id") REFERENCES "company_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metric_events" ADD CONSTRAINT "metric_events_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metric_events" ADD CONSTRAINT "metric_events_company_member_id_fkey" FOREIGN KEY ("company_member_id") REFERENCES "company_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;
