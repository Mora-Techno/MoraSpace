import { DASHBOARD_ENDPOINTS } from '../endpoints/dashboard.endpoints';
import type { TResponse } from '../types/response.types';
import type { OwnerDashboardOverview } from '../types/dashboard.types';
import { GetResponse } from './http';
import { toServiceResponse } from './service-response';

class DashboardService {
  public async GetOwnerOverview(): Promise<TResponse<OwnerDashboardOverview>> {
    const res = await GetResponse<OwnerDashboardOverview>(DASHBOARD_ENDPOINTS.OWNER);
    return toServiceResponse(res, { message: 'Ringkasan dashboard berhasil diambil' });
  }
}

export default new DashboardService();
