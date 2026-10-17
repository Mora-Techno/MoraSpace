import TasksContainer from '@/app/(private)/member/tasks/_containers/tasks';

export default async function OwnerMemberTaskModulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TasksContainer moduleId={id} />;
}
