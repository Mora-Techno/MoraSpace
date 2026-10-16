import WorkingHoursService from '@/service/WorkingHoursService';
import { HttpResponse } from '@/http';
import { getUser } from '@/utils/authTokens';
import type { AppContext } from '@/contex';
import { memberContextValidate } from '@/validation/auth.validate';

class WorkingHoursController {
  public async getStatus(c: AppContext) {
    try {
      const user = getUser(c);
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const memberId = c.query.memberId as string | undefined;

      if (memberId) {
        const status = await WorkingHoursService.getMemberStatus(user.companyId!, memberId);
        if (!status) return HttpResponse(c).notFound('Anggota tidak ditemukan');

        void WorkingHoursService.recordMetricEvent(
          user.companyId!,
          user.companyMemberId ?? null,
          'WORKING_STATUS_VIEWED',
        );

        return HttpResponse(c).ok(status, undefined, 'Status jam kerja anggota');
      }

      const allStatuses = await WorkingHoursService.getAllMembersStatus(user.companyId!);
      void WorkingHoursService.recordMetricEvent(
        user.companyId!,
        user.companyMemberId ?? null,
        'WORKING_STATUS_VIEWED',
      );

      return HttpResponse(c).ok(allStatuses, undefined, 'Daftar status jam kerja anggota');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async getQuota(c: AppContext) {
    try {
      const user = getUser(c);
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const quota = await WorkingHoursService.getUrgentQuota(
        user.companyId!,
        user.companyMemberId!,
      );
      return HttpResponse(c).ok(quota, undefined, 'Kuota pesan mendesak');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async getOwnerMetrics(c: AppContext) {
    try {
      const user = getUser(c);
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      if (user.companyRole !== 'Owner') {
        return HttpResponse(c).forbidden('Hanya Owner yang dapat mengakses ringkasan metrik');
      }

      const summary = await WorkingHoursService.getOwnerMetricsSummary(user.companyId!);
      return HttpResponse(c).ok(summary, undefined, 'Ringkasan metrik jam kerja');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async recordAppOpened(c: AppContext) {
    try {
      const user = getUser(c);
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const status = await WorkingHoursService.getMemberStatus(
        user.companyId!,
        user.companyMemberId!,
      );
      if (status && status.status === 'out_of_hours') {
        void WorkingHoursService.recordMetricEvent(
          user.companyId!,
          user.companyMemberId!,
          'APP_OPENED_OUT_OF_HOURS',
        );
      }

      return HttpResponse(c).ok({ recorded: true }, undefined, 'Metrik dicatat');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }
}

export default new WorkingHoursController();
