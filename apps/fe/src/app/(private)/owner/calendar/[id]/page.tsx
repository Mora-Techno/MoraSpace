import { redirect } from "next/navigation";

export default async function OwnerCalendarEventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/owner/member/calendar/${id}`);
}
