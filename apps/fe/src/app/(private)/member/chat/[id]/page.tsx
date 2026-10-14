import ChatRoomContainer from './_containers/chat-room';

export default async function MemberChatRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ChatRoomContainer id={id} />;
}
