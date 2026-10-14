import ChatRoomContainer from '@/app/(private)/member/chat/[id]/_containers/chat-room';

export default async function OwnerMemberChatRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ChatRoomContainer id={id} />;
}
