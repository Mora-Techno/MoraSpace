import { INVITATION_ENDPOINTS } from "../endpoints/invitation.endpoints";
import type { IInvitation, PickCreateInvitation, PickAcceptInvitation, PickRejectInvitation } from "../types/invitation.types";
import type { TResponse } from "../types/response.types";
import { DeleteResponse, GetResponse, PostResponse } from "./http";
import { toServiceResponse } from "./service-response";

class InvitationService {
  public async ListInvitations(): Promise<TResponse<IInvitation[]>> {
    const res = await GetResponse<IInvitation[]>(INVITATION_ENDPOINTS.LIST);
    return toServiceResponse(res, { message: "Daftar undangan berhasil diambil" });
  }

  public async CreateInvitation(payload: PickCreateInvitation): Promise<TResponse<IInvitation>> {
    const res = await PostResponse<IInvitation>(INVITATION_ENDPOINTS.CREATE, payload);
    return toServiceResponse(res, { message: "Undangan berhasil dikirim", statusCode: 201 });
  }

  public async AcceptInvitation(payload: PickAcceptInvitation): Promise<TResponse<any>> {
    const res = await PostResponse<any>(INVITATION_ENDPOINTS.ACCEPT, payload);
    return toServiceResponse(res, { message: "Undangan berhasil diterima" });
  }

  public async RejectInvitation(payload: PickRejectInvitation): Promise<TResponse<any>> {
    const res = await PostResponse<any>(INVITATION_ENDPOINTS.REJECT, payload);
    return toServiceResponse(res, { message: "Undangan berhasil ditolak" });
  }

  public async DeleteInvitation(id: string): Promise<TResponse<IInvitation>> {
    const res = await DeleteResponse<IInvitation>(INVITATION_ENDPOINTS.DELETE(id));
    return toServiceResponse(res, { message: "Undangan berhasil dibatalkan" });
  }
}

export default new InvitationService();
