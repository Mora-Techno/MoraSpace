export type TodoStatus = "pending" | "completed";

/** Mirror Prisma model `Todo` */
export interface ITodo {
  id: string;
  text: string;
  status: TodoStatus;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type Todo = Pick<ITodo, "id" | "text" | "status"> & {
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TodoQuery = {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: TodoStatus;
  date?: "today";
  startDate?: string;
  endDate?: string;
};

export type PickCreateTodo = Pick<ITodo, "text"> & {
  dueDate?: string;
};

export type PickUpdateTodo = Partial<Pick<ITodo, "text" | "status">> & {
  dueDate?: string | null;
};

export type TodoParams = Pick<ITodo, "id">;
