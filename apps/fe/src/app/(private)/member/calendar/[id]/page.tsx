import EventDetailContainer from "./_container/eventDetail";

export default async function CalendarEventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EventDetailContainer id={id} />;
}
