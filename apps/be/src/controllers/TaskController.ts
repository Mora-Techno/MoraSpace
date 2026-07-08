import TaskService from "@/service/TaskService";
import { HttpResponse } from "@/http";
import { getUser } from "@/utils/authTokens";
import { memberContextValidate, paramsValidate } from "@/validation/auth.validate";
import type { AppContext } from "@/contex";
import type {
  PickCreateTask,
  PickUpdateTask,
  PickAssignTask,
  PickUpdateTaskStatus,
  PickAddTaskComment,
  PickCreateTaskChecklist,
  PickAddTaskAttachment,
} from "@repo/types/task.types";

class TaskController {
  public async list(c: AppContext) {
    try {
      const user = getUser(c);
      const page = Number((c.query as any)?.page) || Number((c.params as any)?.page) || Number(c.params) || 1;
      const limit = Number(c.query.limit) || 10;

      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const result = await TaskService.list(user.companyId!, page, limit);
      return HttpResponse(c).ok(result.data, result.meta, "Berhasil mengambil daftar tugas");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async getById(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await TaskService.getById(params.id, user.companyId!);
      if (!data) return HttpResponse(c).notFound("Tugas tidak ditemukan");

      return HttpResponse(c).ok(data, undefined, "Berhasil mengambil detail tugas");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async create(c: AppContext) {
    try {
      const user = getUser(c);
      const body = c.body as PickCreateTask;
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const data = await TaskService.create(user.companyId!, user.companyMemberId!, body);
      return HttpResponse(c).created(data, "Tugas berhasil dibuat");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async update(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const body = c.body as PickUpdateTask;
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await TaskService.update(params.id, user.companyId!, user.companyMemberId!, body);
      if (!data) return HttpResponse(c).notFound("Tugas tidak ditemukan");

      return HttpResponse(c).ok(data, "Tugas berhasil diperbarui");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async remove(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await TaskService.remove(params.id, user.companyId!);
      if (!data) return HttpResponse(c).notFound("Tugas tidak ditemukan");

      return HttpResponse(c).ok(data, "Tugas berhasil dihapus");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async assign(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const body = c.body as PickAssignTask;
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await TaskService.assign(params.id, user.companyId!, user.companyMemberId!, body.assigneeIds);
      if (!data) return HttpResponse(c).notFound("Tugas tidak ditemukan");

      return HttpResponse(c).ok(data, "Penugasan berhasil diperbarui");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async updateStatus(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const body = c.body as PickUpdateTaskStatus;
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await TaskService.updateStatus(params.id, user.companyId!, user.companyMemberId!, body.statusId);
      if (!data) return HttpResponse(c).notFound("Tugas tidak ditemukan");

      return HttpResponse(c).ok(data, "Status tugas berhasil diperbarui");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async addComment(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const body = c.body as PickAddTaskComment;
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await TaskService.addComment(params.id, user.companyId!, user.companyMemberId!, body.content);
      if (!data) return HttpResponse(c).notFound("Tugas tidak ditemukan");

      return HttpResponse(c).created(data, "Komentar berhasil ditambahkan");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async createChecklist(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const body = c.body as PickCreateTaskChecklist;
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await TaskService.createChecklist(params.id, user.companyId!, user.companyMemberId!, body);
      if (!data) return HttpResponse(c).notFound("Tugas tidak ditemukan");

      return HttpResponse(c).created(data, "Checklist berhasil dibuat");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async addAttachment(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const body = c.body as PickAddTaskAttachment;
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await TaskService.addAttachment(params.id, user.companyId!, user.companyMemberId!, body);
      if (!data) return HttpResponse(c).notFound("Tugas tidak ditemukan");

      return HttpResponse(c).created(data, "Lampiran berhasil ditambahkan");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async listActivities(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const page = Number((c.query as any)?.page) || Number((c.params as any)?.page) || 1;
      const limit = Number(c.query.limit) || 10;

      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const result = await TaskService.listActivities(params.id, user.companyId!, page, limit);
      if (!result) return HttpResponse(c).notFound("Tugas tidak ditemukan");

      return HttpResponse(c).ok(result.data, result.meta, "Berhasil mengambil riwayat aktivitas tugas");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }
}

export default new TaskController();
