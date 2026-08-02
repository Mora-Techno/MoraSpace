import Elysia from "elysia";
import TodoController from "@/controllers/TodoController";
import {
  CreateTodoDto,
  TodoParamsDto,
  TodoQueryDto,
  UpdateTodoDto,
} from "@/dto/todo.dto";
import type { AppContext } from "@/contex";
import { verifyToken } from "@/middlewares/auth";

class TodoRouter {
  public todoRouter;

  constructor() {
    this.todoRouter = new Elysia({ prefix: "/todos", tags: ["Todos"] });
    this.routes();
  }

  private routes() {
    this.todoRouter.get("/", (c: AppContext) => TodoController.list(c), {
      query: TodoQueryDto,
      beforeHandle: [verifyToken().beforeHandle],
      detail: {
        summary: "Daftar semua tugas",
        description:
          "Menampilkan semua daftar tugas. Mendukung filter `?status=completed|pending` atau `?date=today`.",
        tags: ["Todos"],
      },
    });
    this.todoRouter.get("/:id", (c: AppContext) => TodoController.getById(c), {
      params: TodoParamsDto,
      beforeHandle: [verifyToken().beforeHandle],
      detail: {
        summary: "Detail tugas",
        description: "Menampilkan detail lengkap satu tugas berdasarkan ID.",
        tags: ["Todos"],
      },
    });
    this.todoRouter.post("/", (c: AppContext) => TodoController.create(c), {
      body: CreateTodoDto,
      beforeHandle: [verifyToken().beforeHandle],
      detail: {
        summary: "Buat tugas baru",
        description:
          "Membuat tugas baru dengan teks dan tenggat waktu opsional.",
        tags: ["Todos"],
      },
    });
    this.todoRouter.patch("/:id", (c: AppContext) => TodoController.update(c), {
      params: TodoParamsDto,
      body: UpdateTodoDto,
      beforeHandle: [verifyToken().beforeHandle],
      detail: {
        summary: "Perbarui tugas",
        description:
          "Mengubah status tugas (pending/completed), teks, atau tenggat waktu.",
        tags: ["Todos"],
      },
    });
    this.todoRouter.delete(
      "/:id",
      (c: AppContext) => TodoController.remove(c),
      {
        params: TodoParamsDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Hapus tugas",
          description: "Menghapus tugas dari daftar berdasarkan ID.",
          tags: ["Todos"],
        },
      },
    );
  }
}

export default new TodoRouter().todoRouter;
