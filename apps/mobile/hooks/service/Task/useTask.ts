import {
  useAddTaskAttachment,
  useAddTaskComment,
  useAssignTask,
  useCreateTask,
  useCreateTaskChecklist,
  useDeleteTask,
  useUpdateTask,
  useUpdateTaskStatus,
} from './state/mutate';
import { useGetTask, useListTaskActivities, useListTasks } from './state/query';

export const useTask = () => {
  return {
    mutate: {
      create: useCreateTask,
      update: useUpdateTask,
      delete: useDeleteTask,
      assign: useAssignTask,
      updateStatus: useUpdateTaskStatus,
      addComment: useAddTaskComment,
      createChecklist: useCreateTaskChecklist,
      addAttachment: useAddTaskAttachment,
    },
    query: {
      list: useListTasks,
      detail: useGetTask,
      activities: useListTaskActivities,
    },
  };
};
