import { WORKSTATION_ENDPOINTS } from "../endpoints/workstation.endpoints";
import type { TResponse } from "../types/response.types";
import type {
  PickCreateWorkstation,
  PickInviteMember,
  PickUpdateWorkstation,
  Workstation,
  WorkstationMember,
} from "../types/workstation.types";
import {
  DeleteResponse,
  GetResponse,
  PatchResponse,
  PostResponse,
} from "./http";
import { toServiceResponse } from "./service-response";

class WorkstationService {
  public async ListWorkstations(): Promise<TResponse<Workstation[]>> {
    const res = await GetResponse<Workstation[]>(WORKSTATION_ENDPOINTS.LIST);
    return toServiceResponse(res, {
      message: "Daftar workstation berhasil diambil",
    });
  }
  public async CreateWorkstation(
    payload: PickCreateWorkstation,
  ): Promise<TResponse<Workstation>> {
    const res = await PostResponse<Workstation>(
      WORKSTATION_ENDPOINTS.CREATE,
      payload,
    );
    return toServiceResponse(res, {
      message: "Workstation berhasil dibuat",
      statusCode: 201,
    });
  }
  public async GetWorkstation(id: string): Promise<TResponse<Workstation>> {
    const res = await GetResponse<Workstation>(WORKSTATION_ENDPOINTS.BYID(id));
    return toServiceResponse(res, {
      message: "Detail workstation berhasil diambil",
    });
  }
  public async UpdateWorkstation(
    id: string,
    payload: PickUpdateWorkstation,
  ): Promise<TResponse<Workstation>> {
    const res = await PatchResponse<Workstation>(
      WORKSTATION_ENDPOINTS.UPDATE(id),
      payload,
    );
    return toServiceResponse(res, {
      message: "Workstation berhasil diperbarui",
    });
  }
  public async DeleteWorkstation(id: string): Promise<TResponse<Workstation>> {
    const res = await DeleteResponse<Workstation>(
      WORKSTATION_ENDPOINTS.DELETE(id),
    );
    return toServiceResponse(res, {
      message: "Workstation berhasil dihapus",
    });
  }
  public async InviteMember(
    workstationId: string,
    payload: PickInviteMember,
  ): Promise<TResponse<WorkstationMember>> {
    const res = await PostResponse<WorkstationMember>(
      WORKSTATION_ENDPOINTS.BYIDMEMBER(workstationId),
      payload,
    );
    return toServiceResponse(res, {
      message: "Anggota berhasil diinvite",
      statusCode: 201,
    });
  }
  public async RemoveMember(
    workstationId: string,
    userId: string,
  ): Promise<TResponse<WorkstationMember>> {
    const res = await DeleteResponse<WorkstationMember>(
      WORKSTATION_ENDPOINTS.REMOVEMEMBER(workstationId, userId),
    );
    return toServiceResponse(res, {
      message: "Anggota berhasil dihapus",
    });
  }
}
export default new WorkstationService();
