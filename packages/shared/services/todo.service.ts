import { TODO_ENDPOINTS } from "../endpoints/todo.endpoints";
import type { TResponse } from "../types/response.types";
import type {
  PickCreateTodo,
  PickUpdateTodo,
  Todo,
  TodoQuery,
} from "../types/todo.types";
import {
  DeleteResponse,
  GetResponse,
  PatchResponse,
  PostResponse,
  withQuery,
} from "./http";
import { toServiceResponse } from "./service-response";

class TodoService {
  public async ListTodos(query?: TodoQuery): Promise<TResponse<Todo[]>> {
    const res = await GetResponse<Todo[]>(
      withQuery(TODO_ENDPOINTS.LIST, query),
    );
    return toServiceResponse(res, { message: "Daftar tugas berhasil diambil" });
  }
  public async GetTodo(id: string): Promise<TResponse<Todo>> {
    const res = await GetResponse<Todo>(TODO_ENDPOINTS.BYID(id));
    return toServiceResponse(res, { message: "Detail tugas berhasil diambil" });
  }
  public async CreateTodo(payload: PickCreateTodo): Promise<TResponse<Todo>> {
    const res = await PostResponse<Todo>(TODO_ENDPOINTS.CREATE, payload);
    return toServiceResponse(res, {
      message: "Tugas berhasil dibuat",
      statusCode: 201,
    });
  }
  public async UpdateTodo(
    id: string,
    payload: PickUpdateTodo,
  ): Promise<TResponse<Todo>> {
    const res = await PatchResponse<Todo>(TODO_ENDPOINTS.UPDATE(id), payload);
    return toServiceResponse(res, { message: "Tugas berhasil diperbarui" });
  }
  public async DeleteTodo(id: string): Promise<TResponse<Todo>> {
    const res = await DeleteResponse<Todo>(TODO_ENDPOINTS.DELETE(id));
    return toServiceResponse(res, { message: "Tugas berhasil dihapus" });
  }
}
export default new TodoService();
