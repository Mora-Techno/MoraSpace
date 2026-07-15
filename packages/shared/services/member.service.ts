import { MEMBER_ENDPOINTS } from '../endpoints/member.endpoints';
import type {
  ICompanyMember,
  PickUpdateCompanyMember,
  PickUpdateMemberContacts,
  PickUpdateMemberProfile,
} from '../types/member.types';
import type { TResponse } from '../types/response.types';
import { DeleteResponse, GetResponse, PatchResponse } from './http';
import { toServiceResponse } from './service-response';

class MemberService {
  public async ListMembers(): Promise<TResponse<ICompanyMember[]>> {
    const res = await GetResponse<ICompanyMember[]>(MEMBER_ENDPOINTS.LIST);
    return toServiceResponse(res, { message: 'Daftar anggota berhasil diambil' });
  }

  public async GetMember(id: string): Promise<TResponse<ICompanyMember>> {
    const res = await GetResponse<ICompanyMember>(MEMBER_ENDPOINTS.BYID(id));
    return toServiceResponse(res, { message: 'Detail anggota berhasil diambil' });
  }

  public async UpdateMember(
    id: string,
    payload: PickUpdateCompanyMember,
  ): Promise<TResponse<ICompanyMember>> {
    const res = await PatchResponse<ICompanyMember>(MEMBER_ENDPOINTS.UPDATE(id), payload);
    return toServiceResponse(res, { message: 'Data anggota berhasil diperbarui' });
  }

  public async DeleteMember(id: string): Promise<TResponse<ICompanyMember>> {
    const res = await DeleteResponse<ICompanyMember>(MEMBER_ENDPOINTS.DELETE(id));
    return toServiceResponse(res, { message: 'Anggota berhasil dihapus' });
  }

  public async GetProfile(id: string): Promise<TResponse<any>> {
    const res = await GetResponse<any>(MEMBER_ENDPOINTS.PROFILE(id));
    return toServiceResponse(res, { message: 'Profil anggota berhasil diambil' });
  }

  public async UpdateProfile(
    id: string,
    payload: PickUpdateMemberProfile,
  ): Promise<TResponse<any>> {
    const res = await PatchResponse<any>(MEMBER_ENDPOINTS.UPDATE_PROFILE(id), payload);
    return toServiceResponse(res, { message: 'Profil anggota berhasil diperbarui' });
  }

  public async GetContacts(id: string): Promise<TResponse<any>> {
    const res = await GetResponse<any>(MEMBER_ENDPOINTS.CONTACTS(id));
    return toServiceResponse(res, { message: 'Kontak anggota berhasil diambil' });
  }

  public async UpdateContacts(
    id: string,
    payload: PickUpdateMemberContacts,
  ): Promise<TResponse<any>> {
    const res = await PatchResponse<any>(MEMBER_ENDPOINTS.UPDATE_CONTACTS(id), payload);
    return toServiceResponse(res, { message: 'Kontak anggota berhasil diperbarui' });
  }
}

export default new MemberService();
