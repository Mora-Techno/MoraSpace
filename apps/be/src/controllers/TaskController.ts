import type {
  PickAddTaskAttachment,
  PickAddTaskComment,
  PickAssignTask,
  PickCreateTask,
  PickCreateTaskChecklist,
  PickUpdateTask,
  PickUpdateTaskStatus,
} from '@repo/types/task.types';
import type { AppContext } from '@/contex';
import { HttpResponse } from '@/http';
import TaskService from '@/service/TaskService';
import { getUser } from '@/utils/authTokens';
import { paramsValidate, personalContextValidate } from '@/validation/auth.validate';

class TaskController {
  public async listStatuses(c: AppContext) {
    const user = getUser(c);
    const invalid = await personalContextValidate(user, c);
    if (invalid) return invalid;
    return HttpResponse(c).ok(
      await TaskService.listStatuses(user.companyId ?? null, user.id),
      undefined,
      'Daftar status tugas',
    );
  }

  public async createStatus(c: AppContext) {
    try {
      const user = getUser(c);
      const invalid = await personalContextValidate(user, c);
      if (invalid) return invalid;

      const body = c.body as { name: string; color?: string; sortOrder?: number };
      const data = await TaskService.createStatus(user.companyId ?? null, user.id, body);
      return HttpResponse(c).created(data, 'Status tugas berhasil dibuat');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async updateStatusItem(c: AppContext) {
    try {
      const user = getUser(c);
      const invalid = await personalContextValidate(user, c);
      if (invalid) return invalid;

      const params = c.params as { id: string };
      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const body = c.body as { name?: string; color?: string; sortOrder?: number };
      const data = await TaskService.updateStatusItem(
        params.id,
        user.companyId ?? null,
        user.id,
        body,
      );
      return HttpResponse(c).ok(data, undefined, 'Status tugas berhasil diperbarui');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Gagal memperbarui status tugas';
      return HttpResponse(c).badRequest(msg);
    }
  }

  public async deleteStatusItem(c: AppContext) {
    try {
      const user = getUser(c);
      const invalid = await personalContextValidate(user, c);
      if (invalid) return invalid;

      const params = c.params as { id: string };
      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await TaskService.deleteStatusItem(params.id, user.companyId ?? null, user.id);
      return HttpResponse(c).ok(data, undefined, 'Status tugas berhasil dihapus');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Gagal menghapus status tugas';
      return HttpResponse(c).badRequest(msg);
    }
  }

  public async listPriorities(c: AppContext) {
    const user = getUser(c);
    const invalid = await personalContextValidate(user, c);
    if (invalid) return invalid;
    return HttpResponse(c).ok(
      await TaskService.listPriorities(user.companyId ?? null, user.id),
      undefined,
      'Daftar prioritas tugas',
    );
  }

  public async list(c: AppContext) {
    try {
      const user = getUser(c);

      const authResponse = await personalContextValidate(user, c);
      if (authResponse) return authResponse;

      const result = await TaskService.list(user.companyId ?? null, user.id, c.query as any, {
        companyRole: user.companyRole,
        companyMemberId: user.companyMemberId,
        userId: user.id,
      });
      return HttpResponse(c).ok(result.data, result.meta, 'Berhasil mengambil daftar tugas');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async getById(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const authResponse = await personalContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await TaskService.getById(params.id, user.companyId ?? null, user.id, {
        companyRole: user.companyRole,
        companyMemberId: user.companyMemberId,
        userId: user.id,
      });
      if (!data) return HttpResponse(c).notFound('Tugas tidak ditemukan');

      return HttpResponse(c).ok(data, undefined, 'Berhasil mengambil detail tugas');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async create(c: AppContext) {
    try {
      const user = getUser(c);
      const body = c.body as PickCreateTask;
      const authResponse = await personalContextValidate(user, c);
      if (authResponse) return authResponse;

      const data = await TaskService.create(
        user.companyId ?? null,
        user.companyMemberId ?? null,
        user.id,
        body,
      );
      return HttpResponse(c).created(data, 'Tugas berhasil dibuat');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async update(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const body = c.body as PickUpdateTask;
      const authResponse = await personalContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await TaskService.update(
        params.id,
        user.companyId ?? null,
        user.id,
        user.companyMemberId ?? null,
        body,
        {
          companyRole: user.companyRole,
          companyMemberId: user.companyMemberId,
          userId: user.id,
        },
      );
      if (!data) return HttpResponse(c).notFound('Tugas tidak ditemukan');

      return HttpResponse(c).ok(data, undefined, 'Tugas berhasil diperbarui');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async remove(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const authResponse = await personalContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await TaskService.remove(params.id, user.companyId ?? null, user.id, {
        companyRole: user.companyRole,
        companyMemberId: user.companyMemberId,
        userId: user.id,
      });
      if (!data) return HttpResponse(c).notFound('Tugas tidak ditemukan');

      return HttpResponse(c).ok(data, undefined, 'Tugas berhasil dihapus');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async assign(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const body = c.body as PickAssignTask;
      const authResponse = await personalContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await TaskService.assign(
        params.id,
        user.companyId ?? null,
        user.id,
        user.companyMemberId ?? null,
        body.assigneeIds,
        {
          companyRole: user.companyRole,
          companyMemberId: user.companyMemberId,
          userId: user.id,
        },
      );
      if (!data) return HttpResponse(c).notFound('Tugas tidak ditemukan');

      return HttpResponse(c).ok(data, undefined, 'Penugasan berhasil diperbarui');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async updateStatus(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const body = c.body as PickUpdateTaskStatus;
      const authResponse = await personalContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await TaskService.updateStatus(
        params.id,
        user.companyId ?? null,
        user.id,
        user.companyMemberId ?? null,
        body.statusId,
        {
          companyRole: user.companyRole,
          companyMemberId: user.companyMemberId,
          userId: user.id,
        },
      );
      if (!data) return HttpResponse(c).notFound('Tugas tidak ditemukan');

      return HttpResponse(c).ok(data, undefined, 'Status tugas berhasil diperbarui');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async addComment(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const body = c.body as PickAddTaskComment;
      const authResponse = await personalContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await TaskService.addComment(
        params.id,
        user.companyId ?? null,
        user.id,
        user.companyMemberId ?? null,
        body.content,
      );
      if (!data) return HttpResponse(c).notFound('Tugas tidak ditemukan');

      return HttpResponse(c).created(data, 'Komentar berhasil ditambahkan');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async createChecklist(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const body = c.body as PickCreateTaskChecklist;
      const authResponse = await personalContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await TaskService.createChecklist(
        params.id,
        user.companyId ?? null,
        user.id,
        user.companyMemberId ?? null,
        body,
      );
      if (!data) return HttpResponse(c).notFound('Tugas tidak ditemukan');

      return HttpResponse(c).created(data, 'Checklist berhasil dibuat');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async addAttachment(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const body = c.body as PickAddTaskAttachment;
      const authResponse = await personalContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await TaskService.addAttachment(
        params.id,
        user.companyId ?? null,
        user.id,
        user.companyMemberId ?? null,
        body,
      );
      if (!data) return HttpResponse(c).notFound('Tugas tidak ditemukan');

      return HttpResponse(c).created(data, 'Lampiran berhasil ditambahkan');
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

      const authResponse = await personalContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const result = await TaskService.listActivities(
        params.id,
        user.companyId ?? null,
        user.id,
        page,
        limit,
      );
      if (!result) return HttpResponse(c).notFound('Tugas tidak ditemukan');

      return HttpResponse(c).ok(
        result.data,
        result.meta,
        'Berhasil mengambil riwayat aktivitas tugas',
      );
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }
}

export default new TaskController();
