import TodosContainer from '@/app/(private)/member/todos/_containers/todos';

export default async function OwnerMemberTodoModulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TodosContainer moduleId={id} />;
}
