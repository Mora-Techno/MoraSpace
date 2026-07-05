import Elysia from "elysia";
import NoteController from "@/controllers/NoteController";
import { CreateNoteDto, NoteParamsDto, UpdateNoteDto } from "@/dto/note.dto";
import { AppContext } from "@/contex";
import { verifyToken } from "@/middlewares/auth";

class NoteRouter {
  public noteRouter;

  constructor() {
    this.noteRouter = new Elysia({ prefix: "/notes", tags: ["Notes"] });
    this.routes();
  }

  private routes() {
    this.noteRouter.get("/", (c: AppContext) => NoteController.list(c), {
      beforeHandle: [verifyToken().beforeHandle],
      detail: {
        summary: "Daftar semua catatan",
        description:
          "Menampilkan rangkuman atau daftar semua catatan yang tersimpan.",
        tags: ["Notes"],
      },
    });
    this.noteRouter.get("/:id", (c: AppContext) => NoteController.getById(c), {
      params: NoteParamsDto,
      beforeHandle: [verifyToken().beforeHandle],
      detail: {
        summary: "Detail catatan",
        description: "Menampilkan isi penuh dari satu catatan spesifik.",
        tags: ["Notes"],
      },
    });
    this.noteRouter.post("/", (c: AppContext) => NoteController.create(c), {
      body: CreateNoteDto,
      beforeHandle: [verifyToken().beforeHandle],
      detail: {
        summary: "Simpan catatan baru",
        description: "Menyimpan catatan baru berisi judul dan konten.",
        tags: ["Notes"],
      },
    });
    this.noteRouter.put("/:id", (c: AppContext) => NoteController.update(c), {
      params: NoteParamsDto,
      body: UpdateNoteDto,
      beforeHandle: [verifyToken().beforeHandle],
      detail: {
        summary: "Edit catatan",
        description:
          "Menyimpan perubahan secara menyeluruh pada catatan yang sudah ada.",
        tags: ["Notes"],
      },
    });
    this.noteRouter.delete(
      "/:id",
      (c: AppContext) => NoteController.remove(c),
      {
        params: NoteParamsDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Hapus catatan",
          description: "Menghapus catatan secara permanen berdasarkan ID.",
          tags: ["Notes"],
        },
      },
    );
  }
}

export default new NoteRouter().noteRouter;
