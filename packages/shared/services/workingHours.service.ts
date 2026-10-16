import { WORKING_HOURS_ENDPOINTS } from '../endpoints/workingHours.endpoints';
import type { TResponse } from '../types/response.types';
import type {
  MemberWorkingStatus,
  OwnerMetricsSummary,
  UrgentQuotaStatus,
  WorkingHoursStatusQuery,
} from '../types/workingHours.types';
import { GetResponse, PostResponse, withQuery } from './http';
import { toServiceResponse } from './service-response';

class WorkingHoursService {
  public async GetStatus(
    query?: WorkingHoursStatusQuery,
  ): Promise<TResponse<MemberWorkingStatus | MemberWorkingStatus[]>> {
    const res = await GetResponse<MemberWorkingStatus | MemberWorkingStatus[]>(
      withQuery(WORKING_HOURS_ENDPOINTS.STATUS, query),
    );
    return toServiceResponse(res, { message: 'Status jam kerja berhasil diambil' });
  }

  public async GetQuota(): Promise<TResponse<UrgentQuotaStatus>> {
    const res = await GetResponse<UrgentQuotaStatus>(WORKING_HOURS_ENDPOINTS.QUOTA);
    return toServiceResponse(res, { message: 'Status kuota mendesak berhasil diambil' });
  }

  public async GetMetrics(query?: {
    range?: '7d' | '30d';
  }): Promise<TResponse<OwnerMetricsSummary>> {
    const res = await GetResponse<OwnerMetricsSummary>(
      withQuery(WORKING_HOURS_ENDPOINTS.METRICS, query),
    );
    return toServiceResponse(res, { message: 'Metrik jam kerja berhasil diambil' });
  }

  public async RecordAppOpened(): Promise<TResponse<{ recorded: boolean }>> {
    const res = await PostResponse<{ recorded: boolean }>(WORKING_HOURS_ENDPOINTS.APP_OPENED, {});
    return toServiceResponse(res, { message: 'Aktivitas pembukaan app dicatat' });
  }
}

const workingHoursService = new WorkingHoursService();
export default workingHoursService;
