import { useCreateTodo, useDeleteTodo, useUpdateTodo } from "./state/mutate";
import { useTodos } from "./state/query";

export const useTodo = () => {
  return {
    mutate: {
      create: useCreateTodo,
      delete: useDeleteTodo,
      update: useUpdateTodo,
    },
    query: {
      get: useTodos,
    },
  };
};
