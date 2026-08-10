import NoteDetailContainer from "./_containers/note-detail";

export default async function OwnerMemberNoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <NoteDetailContainer id={id} />;
}
