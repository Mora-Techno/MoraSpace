import TodoService from "@/service/TodoService";
import { HttpResponse } from "@/http";
import type { AppContext } from "@/contex";
import type {
  PickCreateTodo,
  PickUpdateTodo,
  TodoQuery,
} from "@repo/types/todo.types";
import {
  paramsValidate,
  personalContextValidate,
} from "@/validation/auth.validate";
import { CreateTodoValidate } from "@/validation/todo.validate";
import { getUser } from "@/utils/authTokens";

class TodoController {
  public async list(c: AppContext) {
    try {
      const user = getUser(c);

      const authRespone = await personalContextValidate(user, c);
      if (authRespone) return authRespone;

      const queryService = await TodoService.list(
        user.companyMemberId ?? null,
        user.id,
        c.query as TodoQuery,
      );

      if (!queryService) {
        return HttpResponse(c).badRequest("");
      }

      return HttpResponse(c).ok(queryService.data, queryService.meta);
    } catch (error) {
      console.error(error);
      return HttpResponse(c).internalError(error);
    }
  }

  public async getById(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };

      const authRespone = await personalContextValidate(user, c);
      if (authRespone) return authRespone;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const queryService = await TodoService.getById(
        params.id,
        user.companyMemberId ?? null,
        user.id,
      );
      if (!queryService)
        return HttpResponse(c).notFound("Tugas tidak ditemukan");

      return HttpResponse(c).ok(
        queryService,
        "Berhasil mengambil detail tugas",
      );
    } catch (error) {
      console.error(error);
      return HttpResponse(c).internalError(error);
    }
  }

  public async create(c: AppContext) {
    try {
      const user = getUser(c);
      const body = c.body as PickCreateTodo;

      const authRespone = await personalContextValidate(user, c);
      if (authRespone) return authRespone;

      const validateRespone = await CreateTodoValidate(c, body);
      if (validateRespone) return validateRespone;

      const queryService = await TodoService.create(
        user.companyMemberId ?? null,
        user.id,
        body,
      );

      if (!queryService) {
        return HttpResponse(c).badRequest();
      }
      return HttpResponse(c).created(queryService, "Tugas berhasil dibuat");
    } catch (error) {
      console.error(error);
      return HttpResponse(c).internalError(error);
    }
  }

  public async update(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };

      const authRespone = await personalContextValidate(user, c);
      if (authRespone) return authRespone;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const body = c.body as PickUpdateTodo;

      const queryService = await TodoService.update(
        params.id,
        user.companyMemberId ?? null,
        user.id,
        body,
      );
      if (!queryService)
        return HttpResponse(c).notFound("Tugas tidak ditemukan");

      return HttpResponse(c).ok(queryService, "Tugas berhasil diperbarui");
    } catch (error) {
      console.error(error);
      return HttpResponse(c).internalError(error);
    }
  }

  public async remove(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };

      const authRespone = await personalContextValidate(user, c);
      if (authRespone) return authRespone;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const queryService = await TodoService.remove(
        params.id,
        user.companyMemberId ?? null,
        user.id,
      );
      if (!queryService)
        return HttpResponse(c).notFound("Tugas tidak ditemukan");
      return HttpResponse(c).ok(queryService, "Tugas berhasil dihapus");
    } catch (error) {
      console.error(error);
      return HttpResponse(c).internalError(error);
    }
  }
}

export default new TodoController();
