import TasksContainer from '../_containers/tasks';

export default async function MemberTaskModulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TasksContainer moduleId={id} />;
}
