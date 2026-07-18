import { POSITION_ENDPOINTS } from '../endpoints/position.endpoints';
import type { IPosition, PickCreatePosition, PickUpdatePosition } from '../types/position.types';
import type { TResponse } from '../types/response.types';
import { DeleteResponse, GetResponse, PatchResponse, PostResponse } from './http';
import { toServiceResponse } from './service-response';

class PositionService {
  public async ListPositions(): Promise<TResponse<IPosition[]>> {
    const res = await GetResponse<IPosition[]>(POSITION_ENDPOINTS.LIST);
    return toServiceResponse(res, { message: 'Daftar jabatan berhasil diambil' });
  }

  public async CreatePosition(payload: PickCreatePosition): Promise<TResponse<IPosition>> {
    const res = await PostResponse<IPosition>(POSITION_ENDPOINTS.CREATE, payload);
    return toServiceResponse(res, { message: 'Jabatan berhasil dibuat', statusCode: 201 });
  }

  public async UpdatePosition(
    id: string,
    payload: PickUpdatePosition,
  ): Promise<TResponse<IPosition>> {
    const res = await PatchResponse<IPosition>(POSITION_ENDPOINTS.UPDATE(id), payload);
    return toServiceResponse(res, { message: 'Jabatan berhasil diperbarui' });
  }

  public async DeletePosition(id: string): Promise<TResponse<IPosition>> {
    const res = await DeleteResponse<IPosition>(POSITION_ENDPOINTS.DELETE(id));
    return toServiceResponse(res, { message: 'Jabatan berhasil dihapus' });
  }
}

export default new PositionService();
