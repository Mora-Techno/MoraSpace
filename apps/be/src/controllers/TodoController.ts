import TodoService from "@/service/TodoService";
import { HttpResponse } from "@/http";
import type { AppContext } from "@/contex";
import type {
  PickCreateTodo,
  PickUpdateTodo,
  TodoQuery,
} from "@repo/types/todo.types";
import { JwtPayload } from "@repo/types/auth.types";
import {
  paramsValidate,
  unauthorizedValidate,
  memberContextValidate,
} from "@/validation/auth.validate";
import { CreateTodoValidate } from "@/validation/todo.validate";

class TodoController {
  public async list(c: AppContext) {
    try {
      const user = c.user as JwtPayload;

      const authRespone = await memberContextValidate(user, c);
      if (authRespone) return authRespone;

      const data = await TodoService.list(user.companyMemberId!, c.query as TodoQuery);

      if (!data) {
        return HttpResponse(c).badRequest("");
      }
      return HttpResponse(c).ok(data, undefined);
    } catch (error) {
      console.error(error);
      return HttpResponse(c).internalError(error);
    }
  }

  public async create(c: AppContext) {
    try {
      const user = c.user as JwtPayload;
      const body = c.body as PickCreateTodo;

      const authRespone = await memberContextValidate(user, c);
      if (authRespone) return authRespone;

      const validateRespone = await CreateTodoValidate(c, body);
      if (validateRespone) return validateRespone;

      const data = await TodoService.create(user.companyMemberId!, body);

      if (!data) {
        return HttpResponse(c).badRequest();
      }
      return HttpResponse(c).created(data, "Tugas berhasil dibuat");
    } catch (error) {
      console.error(error);
      return HttpResponse(c).internalError(error);
    }
  }

  public async update(c: AppContext) {
    try {
      const user = c.user as JwtPayload;
      const params = c.params as { id: string };

      const authRespone = await memberContextValidate(user, c);
      if (authRespone) return authRespone;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const body = c.body as PickUpdateTodo;

      const data = await TodoService.update(params.id, user.companyMemberId!, body);
      if (!data) return HttpResponse(c).notFound("Tugas tidak ditemukan");

      return HttpResponse(c).ok(data, "Tugas berhasil diperbarui");
    } catch (error) {
      console.error(error);
      return HttpResponse(c).internalError(error);
    }
  }

  public async remove(c: AppContext) {
    try {
      const user = c.user as JwtPayload;
      const params = c.params as { id: string };

      const authRespone = await memberContextValidate(user, c);
      if (authRespone) return authRespone;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await TodoService.remove(params.id, user.companyMemberId!);
      if (!data) return HttpResponse(c).notFound("Tugas tidak ditemukan");
      return HttpResponse(c).ok(data, "Tugas berhasil dihapus");
    } catch (error) {
      console.error(error);
      return HttpResponse(c).internalError(error);
    }
  }
}

export default new TodoController();
