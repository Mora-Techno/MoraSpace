import NoteDetailContainer from "./_container/noteDetail";

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <NoteDetailContainer id={id} />;
}
