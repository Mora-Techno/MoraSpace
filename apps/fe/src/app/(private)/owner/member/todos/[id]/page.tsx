import TodoDetailContainer from "./_containers/todo-detail";

export default async function OwnerMemberTodoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TodoDetailContainer id={id} />;
}
