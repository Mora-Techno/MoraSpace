import EventDetailContainer from "../_containers/event-detail";

export default async function OwnerCalendarEventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EventDetailContainer id={id} />;
}
