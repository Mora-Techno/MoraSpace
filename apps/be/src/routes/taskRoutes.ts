import Elysia from "elysia";
import TaskController from "@/controllers/TaskController";
import {
  AddTaskAttachmentDto,
  AddTaskCommentDto,
  AssignTaskDto,
  CreateTaskChecklistDto,
  CreateTaskDto,
  TaskParamsDto,
  UpdateTaskDto,
  UpdateTaskStatusDto,
} from "@/dto/task.dto";
import { AppContext } from "@/contex";
import { verifyToken } from "@/middlewares/auth";

class TaskRouter {
  public taskRouter;

  constructor() {
    this.taskRouter = new Elysia({ prefix: "/tasks", tags: ["Tasks"] });
    this.routes();
  }

  private routes() {
    this.taskRouter.get("/", (c: AppContext) => TaskController.list(c), {
      beforeHandle: [verifyToken().beforeHandle],
      detail: {
        summary: "Daftar semua tugas",
        description: "Menampilkan daftar seluruh tugas di dalam workstation perusahaan.",
        tags: ["Tasks"],
      },
    });
    this.taskRouter.post("/", (c: AppContext) => TaskController.create(c), {
      body: CreateTaskDto,
      beforeHandle: [verifyToken().beforeHandle],
      detail: {
        summary: "Buat tugas baru",
        description: "Membuat tugas baru dengan status, prioritas, serta penugasan opsional.",
        tags: ["Tasks"],
      },
    });
    this.taskRouter.get("/:id", (c: AppContext) => TaskController.getById(c), {
      params: TaskParamsDto,
      beforeHandle: [verifyToken().beforeHandle],
      detail: {
        summary: "Detail tugas",
        description: "Melihat informasi lengkap tugas, komentar, lampiran, checklist, dan riwayat aktivitas.",
        tags: ["Tasks"],
      },
    });
    this.taskRouter.patch("/:id", (c: AppContext) => TaskController.update(c), {
      params: TaskParamsDto,
      body: UpdateTaskDto,
      beforeHandle: [verifyToken().beforeHandle],
      detail: {
        summary: "Perbarui properti tugas",
        description: "Mengubah judul, deskripsi, tenggat waktu, atau penugasan.",
        tags: ["Tasks"],
      },
    });
    this.taskRouter.delete("/:id", (c: AppContext) => TaskController.remove(c), {
      params: TaskParamsDto,
      beforeHandle: [verifyToken().beforeHandle],
      detail: {
        summary: "Hapus tugas",
        description: "Menghapus tugas dari sistem secara permanen.",
        tags: ["Tasks"],
      },
    });
    this.taskRouter.post(
      "/:id/assign",
      (c: AppContext) => TaskController.assign(c),
      {
        params: TaskParamsDto,
        body: AssignTaskDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Tugaskan anggota",
          description: "Menambahkan atau mengganti daftar penanggung jawab (assignees) pada tugas.",
          tags: ["Tasks"],
        },
      },
    );
    this.taskRouter.post(
      "/:id/status",
      (c: AppContext) => TaskController.updateStatus(c),
      {
        params: TaskParamsDto,
        body: UpdateTaskStatusDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Perbarui status tugas",
          description: "Mengubah status tugas (mis. In Progress, Completed).",
          tags: ["Tasks"],
        },
      },
    );
    this.taskRouter.post(
      "/:id/comment",
      (c: AppContext) => TaskController.addComment(c),
      {
        params: TaskParamsDto,
        body: AddTaskCommentDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Tambah komentar",
          description: "Menambahkan komentar pada tugas.",
          tags: ["Tasks"],
        },
      },
    );
    this.taskRouter.post(
      "/:id/checklist",
      (c: AppContext) => TaskController.createChecklist(c),
      {
        params: TaskParamsDto,
        body: CreateTaskChecklistDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Buat checklist tugas",
          description: "Membuat checklist baru atau sub-tugas di dalam tugas.",
          tags: ["Tasks"],
        },
      },
    );
    this.taskRouter.post(
      "/:id/attachment",
      (c: AppContext) => TaskController.addAttachment(c),
      {
        params: TaskParamsDto,
        body: AddTaskAttachmentDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Unggah lampiran tugas",
          description: "Menambahkan file atau tautan lampiran ke dalam tugas.",
          tags: ["Tasks"],
        },
      },
    );
    this.taskRouter.get(
      "/:id/activity",
      (c: AppContext) => TaskController.listActivities(c),
      {
        params: TaskParamsDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Riwayat aktivitas tugas",
          description: "Melihat catatan riwayat perubahan dan aktivitas pada tugas.",
          tags: ["Tasks"],
        },
      },
    );
  }
}

export default new TaskRouter().taskRouter;
