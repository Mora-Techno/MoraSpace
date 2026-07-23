import { TASK_ENDPOINTS } from "../endpoints/task.endpoints";
import type { TResponse } from "../types/response.types";
import type {
  ITask,
  PickAddTaskAttachment,
  PickAddTaskComment,
  PickAssignTask,
  PickCreateTask,
  PickCreateTaskChecklist,
  PickUpdateTask,
  PickUpdateTaskStatus,
  TaskQuery,
} from "../types/task.types";
import {
  DeleteResponse,
  GetResponse,
  PatchResponse,
  PostResponse,
  withQuery,
} from "./http";
import { toServiceResponse } from "./service-response";

class TaskService {
  public async ListTasks(query?: TaskQuery): Promise<TResponse<ITask[]>> {
    const res = await GetResponse<ITask[]>(
      withQuery(TASK_ENDPOINTS.LIST, query),
    );
    return toServiceResponse(res, { message: "Daftar tugas berhasil diambil" });
  }

  public async CreateTask(payload: PickCreateTask): Promise<TResponse<ITask>> {
    const res = await PostResponse<ITask>(TASK_ENDPOINTS.CREATE, payload);
    return toServiceResponse(res, {
      message: "Tugas berhasil dibuat",
      statusCode: 201,
    });
  }

  public async GetTask(id: string): Promise<TResponse<ITask>> {
    const res = await GetResponse<ITask>(TASK_ENDPOINTS.BYID(id));
    return toServiceResponse(res, { message: "Detail tugas berhasil diambil" });
  }

  public async UpdateTask(
    id: string,
    payload: PickUpdateTask,
  ): Promise<TResponse<ITask>> {
    const res = await PatchResponse<ITask>(TASK_ENDPOINTS.UPDATE(id), payload);
    return toServiceResponse(res, { message: "Tugas berhasil diperbarui" });
  }

  public async DeleteTask(id: string): Promise<TResponse<ITask>> {
    const res = await DeleteResponse<ITask>(TASK_ENDPOINTS.DELETE(id));
    return toServiceResponse(res, { message: "Tugas berhasil dihapus" });
  }

  public async AssignTask(
    id: string,
    payload: PickAssignTask,
  ): Promise<TResponse<ITask>> {
    const res = await PostResponse<ITask>(TASK_ENDPOINTS.ASSIGN(id), payload);
    return toServiceResponse(res, { message: "Penugasan berhasil diperbarui" });
  }

  public async UpdateStatus(
    id: string,
    payload: PickUpdateTaskStatus,
  ): Promise<TResponse<ITask>> {
    const res = await PostResponse<ITask>(TASK_ENDPOINTS.STATUS(id), payload);
    return toServiceResponse(res, {
      message: "Status tugas berhasil diperbarui",
    });
  }

  public async AddComment(
    id: string,
    payload: PickAddTaskComment,
  ): Promise<TResponse<unknown>> {
    const res = await PostResponse<unknown>(
      TASK_ENDPOINTS.COMMENT(id),
      payload,
    );
    return toServiceResponse(res, {
      message: "Komentar berhasil ditambahkan",
      statusCode: 201,
    });
  }

  public async CreateChecklist(
    id: string,
    payload: PickCreateTaskChecklist,
  ): Promise<TResponse<unknown>> {
    const res = await PostResponse<unknown>(
      TASK_ENDPOINTS.CHECKLIST(id),
      payload,
    );
    return toServiceResponse(res, {
      message: "Checklist berhasil dibuat",
      statusCode: 201,
    });
  }

  public async AddAttachment(
    id: string,
    payload: PickAddTaskAttachment,
  ): Promise<TResponse<unknown>> {
    const res = await PostResponse<unknown>(
      TASK_ENDPOINTS.ATTACHMENT(id),
      payload,
    );
    return toServiceResponse(res, {
      message: "Lampiran berhasil ditambahkan",
      statusCode: 201,
    });
  }

  public async ListActivities(id: string): Promise<TResponse<unknown[]>> {
    const res = await GetResponse<unknown[]>(TASK_ENDPOINTS.ACTIVITY(id));
    return toServiceResponse(res, {
      message: "Riwayat aktivitas berhasil diambil",
    });
  }
}

export default new TaskService();
