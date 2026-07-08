export interface ITask {
  id: string;
  companyId: string;
  title: string;
  description: string | null;
  statusId: string;
  priorityId: string | null;
  reporterMemberId: string;
  startDate: string | null;
  dueDate: string | null;
  completedAt: string | null;
  estimatedMinutes: number | null;
  createdAt: string;
  updatedAt: string;
}

export type PickCreateTask = {
  title: string;
  description?: string;
  statusId: string;
  priorityId?: string;
  startDate?: string;
  dueDate?: string;
  estimatedMinutes?: number;
  assigneeIds?: string[];
};

export type PickUpdateTask = Partial<PickCreateTask>;

export type PickAssignTask = {
  assigneeIds: string[];
};

export type PickUpdateTaskStatus = {
  statusId: string;
};

export type PickAddTaskComment = {
  content: string;
};

export type PickCreateTaskChecklist = {
  title: string;
  items?: string[];
};

export type PickAddTaskAttachment = {
  fileName: string;
  fileUrl: string;
  fileSize: number;
};
