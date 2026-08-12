import { redirect } from "next/navigation";

export default async function OwnerNoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/owner/member/notes/${id}`);
}
