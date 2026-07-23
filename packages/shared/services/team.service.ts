import { TEAM_ENDPOINTS } from "../endpoints/team.endpoints";
import type { ICompanyMember } from "../types/member.types";
import type { TResponse } from "../types/response.types";
import type {
  ITeam,
  PickAddTeamMember,
  PickCreateTeam,
  PickUpdateTeam,
  TeamQuery,
} from "../types/team.types";
import {
  DeleteResponse,
  GetResponse,
  PatchResponse,
  PostResponse,
  withQuery,
} from "./http";
import { toServiceResponse } from "./service-response";

class TeamService {
  public async ListTeams(query?: TeamQuery): Promise<TResponse<ITeam[]>> {
    const res = await GetResponse<ITeam[]>(
      withQuery(TEAM_ENDPOINTS.LIST, query),
    );
    return toServiceResponse(res, { message: "Daftar tim berhasil diambil" });
  }

  public async CreateTeam(payload: PickCreateTeam): Promise<TResponse<ITeam>> {
    const res = await PostResponse<ITeam>(TEAM_ENDPOINTS.CREATE, payload);
    return toServiceResponse(res, {
      message: "Tim berhasil dibuat",
      statusCode: 201,
    });
  }

  public async UpdateTeam(
    id: string,
    payload: PickUpdateTeam,
  ): Promise<TResponse<ITeam>> {
    const res = await PatchResponse<ITeam>(TEAM_ENDPOINTS.UPDATE(id), payload);
    return toServiceResponse(res, { message: "Tim berhasil diperbarui" });
  }

  public async DeleteTeam(id: string): Promise<TResponse<ITeam>> {
    const res = await DeleteResponse<ITeam>(TEAM_ENDPOINTS.DELETE(id));
    return toServiceResponse(res, { message: "Tim berhasil dihapus" });
  }

  public async ListMembers(
    teamId: string,
  ): Promise<TResponse<ICompanyMember[]>> {
    const res = await GetResponse<ICompanyMember[]>(
      TEAM_ENDPOINTS.MEMBERS(teamId),
    );
    return toServiceResponse(res, {
      message: "Daftar anggota tim berhasil diambil",
    });
  }

  public async AddMember(
    teamId: string,
    payload: PickAddTeamMember,
  ): Promise<TResponse<unknown>> {
    const res = await PostResponse<unknown>(
      TEAM_ENDPOINTS.ADD_MEMBER(teamId),
      payload,
    );
    return toServiceResponse(res, {
      message: "Anggota tim berhasil ditambahkan",
      statusCode: 201,
    });
  }

  public async RemoveMember(
    teamId: string,
    memberId: string,
  ): Promise<TResponse<unknown>> {
    const res = await DeleteResponse<unknown>(
      TEAM_ENDPOINTS.REMOVE_MEMBER(teamId, memberId),
    );
    return toServiceResponse(res, { message: "Anggota tim berhasil dihapus" });
  }

  public async InviteMember(payload: unknown): Promise<TResponse<unknown>> {
    const res = await PostResponse<unknown>(
      TEAM_ENDPOINTS.INVITE_MEMBER,
      payload,
    );
    return toServiceResponse(res, {
      message: "Anggota berhasil diundang ke tim",
      statusCode: 201,
    });
  }
}

export default new TeamService();
