import TodosContainer from '../_containers/todos';

export default async function MemberTodoModulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TodosContainer moduleId={id} />;
}
