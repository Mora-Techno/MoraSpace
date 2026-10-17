import { MODULE_ENDPOINTS } from '../endpoints/module.endpoints';
import type {
  IModule,
  ModuleQuery,
  PickCreateModule,
  PickUpdateModule,
} from '../types/module.types';
import type { TResponse } from '../types/response.types';
import { DeleteResponse, GetResponse, PatchResponse, PostResponse, withQuery } from './http';
import { toServiceResponse } from './service-response';

class ModuleService {
  public async ListModules(query?: ModuleQuery): Promise<TResponse<IModule[]>> {
    const res = await GetResponse<IModule[]>(withQuery(MODULE_ENDPOINTS.LIST, query));
    return toServiceResponse(res, { message: 'Daftar modul berhasil diambil' });
  }

  public async GetModule(id: string): Promise<TResponse<IModule>> {
    const res = await GetResponse<IModule>(MODULE_ENDPOINTS.BYID(id));
    return toServiceResponse(res, { message: 'Detail modul berhasil diambil' });
  }

  public async CreateModule(payload: PickCreateModule): Promise<TResponse<IModule>> {
    const res = await PostResponse<IModule>(MODULE_ENDPOINTS.CREATE, payload);
    return toServiceResponse(res, {
      message: 'Modul berhasil dibuat',
      statusCode: 201,
    });
  }

  public async UpdateModule(id: string, payload: PickUpdateModule): Promise<TResponse<IModule>> {
    const res = await PatchResponse<IModule>(MODULE_ENDPOINTS.UPDATE(id), payload);
    return toServiceResponse(res, { message: 'Modul berhasil diperbarui' });
  }

  public async DeleteModule(id: string): Promise<TResponse<IModule>> {
    const res = await DeleteResponse<IModule>(MODULE_ENDPOINTS.DELETE(id));
    return toServiceResponse(res, { message: 'Modul berhasil dihapus' });
  }
}

export default new ModuleService();
