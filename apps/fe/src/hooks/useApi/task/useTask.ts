import {
  useAddTaskAttachment,
  useAddTaskComment,
  useAssignTask,
  useCreateTask,
  useCreateTaskChecklist,
  useCreateTaskStatus,
  useDeleteTask,
  useDeleteTaskStatusItem,
  useUpdateTask,
  useUpdateTaskStatus,
  useUpdateTaskStatusItem,
} from './state/mutate';
import {
  useGetTask,
  useListTaskActivities,
  useListTaskPriorities,
  useListTaskStatuses,
  useListTasks,
} from './state/query';

export const useTask = () => {
  return {
    mutate: {
      create: useCreateTask,
      update: useUpdateTask,
      delete: useDeleteTask,
      assign: useAssignTask,
      updateStatus: useUpdateTaskStatus,
      createStatus: useCreateTaskStatus,
      updateStatusItem: useUpdateTaskStatusItem,
      deleteStatusItem: useDeleteTaskStatusItem,
      addComment: useAddTaskComment,
      createChecklist: useCreateTaskChecklist,
      addAttachment: useAddTaskAttachment,
    },
    query: {
      list: useListTasks,
      statuses: useListTaskStatuses,
      priorities: useListTaskPriorities,
      detail: useGetTask,
      activities: useListTaskActivities,
    },
  };
};
