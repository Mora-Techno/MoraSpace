import type {
  ITask,
  PickAddTaskAttachment,
  PickAddTaskComment,
  PickAssignTask,
  PickCreateTask,
  PickCreateTaskChecklist,
  PickUpdateTask,
  PickUpdateTaskStatus,
} from "@repo/types";
import { queryKey } from "@/config/query-key";
import { useAppMutation } from "@/hooks/useAppMutation";
import Api from "@/service/props.service";
import { readTaskSnapshot, type TaskCacheContext } from "./utils";

export function useCreateTask() {
  return useAppMutation<ITask, PickCreateTask, TaskCacheContext>({
    mutationFn: (payload) => Api.Task.CreateTask(payload),
    invalidateKeys: [queryKey.tasksRoot()],
    optimistic: (ns) => ({ previousData: readTaskSnapshot(ns) }),
  });
}

export function useUpdateTask() {
  return useAppMutation<
    ITask,
    { id: string; payload: PickUpdateTask },
    TaskCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Task.UpdateTask(id, payload),
    invalidateKeys: [queryKey.tasksRoot()],
    optimistic: (ns) => ({ previousData: readTaskSnapshot(ns) }),
  });
}

export function useDeleteTask() {
  return useAppMutation<ITask, string, TaskCacheContext>({
    mutationFn: (id) => Api.Task.DeleteTask(id),
    invalidateKeys: [queryKey.tasksRoot()],
    optimistic: (ns) => ({ previousData: readTaskSnapshot(ns) }),
  });
}

export function useAssignTask() {
  return useAppMutation<
    ITask,
    { id: string; payload: PickAssignTask },
    TaskCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Task.AssignTask(id, payload),
    invalidateKeys: [queryKey.tasksRoot()],
    optimistic: (ns) => ({ previousData: readTaskSnapshot(ns) }),
  });
}

export function useUpdateTaskStatus() {
  return useAppMutation<
    ITask,
    { id: string; payload: PickUpdateTaskStatus },
    TaskCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Task.UpdateStatus(id, payload),
    invalidateKeys: [queryKey.tasksRoot()],
    optimistic: (ns) => ({ previousData: readTaskSnapshot(ns) }),
  });
}

export function useAddTaskComment() {
  return useAppMutation<
    any,
    { id: string; payload: PickAddTaskComment },
    TaskCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Task.AddComment(id, payload),
    invalidateKeys: [queryKey.tasksRoot()],
    optimistic: (ns) => ({ previousData: readTaskSnapshot(ns) }),
  });
}

export function useCreateTaskChecklist() {
  return useAppMutation<
    any,
    { id: string; payload: PickCreateTaskChecklist },
    TaskCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Task.CreateChecklist(id, payload),
    invalidateKeys: [queryKey.tasksRoot()],
    optimistic: (ns) => ({ previousData: readTaskSnapshot(ns) }),
  });
}

export function useAddTaskAttachment() {
  return useAppMutation<
    any,
    { id: string; payload: PickAddTaskAttachment },
    TaskCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Task.AddAttachment(id, payload),
    invalidateKeys: [queryKey.tasksRoot()],
    optimistic: (ns) => ({ previousData: readTaskSnapshot(ns) }),
  });
}
