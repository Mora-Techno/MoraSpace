import NotificationDetailContainer from "./_container/notificationDetail";

export default async function NotificationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <NotificationDetailContainer id={id} />;
}
