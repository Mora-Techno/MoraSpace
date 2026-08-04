import TodoDetailContainer from "./_container/todoDetail";

export default async function TodoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TodoDetailContainer id={id} />;
}
