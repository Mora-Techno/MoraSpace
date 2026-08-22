import NotificationDetailContainer from "../_containers/notification-detail";

export default async function OwnerNotificationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <NotificationDetailContainer id={id} />;
}
