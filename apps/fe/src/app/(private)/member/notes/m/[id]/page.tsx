import NotesContainer from '@/app/(private)/member/notes/_containers/notes';

export default async function MemberNoteModulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <NotesContainer moduleId={id} />;
}
