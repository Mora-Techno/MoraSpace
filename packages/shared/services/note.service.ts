import { NOTE_ENDPOINTS } from "../endpoints/note.endpoints";
import type {
  Note,
  NoteQuery,
  PickCreateNote,
  PickUpdateNote,
} from "../types/note.types";
import type { TResponse } from "../types/response.types";
import {
  DeleteResponse,
  GetResponse,
  PostResponse,
  PutResponse,
  withQuery,
} from "./http";
import { toServiceResponse } from "./service-response";

class NoteService {
  public async ListNotes(query?: NoteQuery): Promise<TResponse<Note[]>> {
    const res = await GetResponse<Note[]>(
      withQuery(NOTE_ENDPOINTS.LIST, query),
    );
    return toServiceResponse(res, {
      message: "Daftar catatan berhasil diambil",
    });
  }
  public async GetNote(id: string): Promise<TResponse<Note>> {
    const res = await GetResponse<Note>(NOTE_ENDPOINTS.BYID(id));
    return toServiceResponse(res, {
      message: "Detail catatan berhasil diambil",
    });
  }
  public async CreateNote(payload: PickCreateNote): Promise<TResponse<Note>> {
    const res = await PostResponse<Note>(NOTE_ENDPOINTS.CREATE, payload);
    return toServiceResponse(res, {
      message: "Catatan berhasil dibuat",
      statusCode: 201,
    });
  }
  public async UpdateNote(
    id: string,
    payload: PickUpdateNote,
  ): Promise<TResponse<Note>> {
    const res = await PutResponse<Note>(NOTE_ENDPOINTS.UPDATE(id), payload);
    return toServiceResponse(res, { message: "Catatan berhasil diperbarui" });
  }
  public async DeleteNote(id: string): Promise<TResponse<Note>> {
    const res = await DeleteResponse<Note>(NOTE_ENDPOINTS.DELETE(id));
    return toServiceResponse(res, { message: "Catatan berhasil dihapus" });
  }
}

export default new NoteService();
