import type { AppContext } from '@/contex';
import { HttpResponse } from '@/http';
import DashboardService from '@/service/DashboardService';
import { getUser } from '@/utils/authTokens';
import { memberContextValidate } from '@/validation/auth.validate';

class DashboardController {
  public async ownerOverview(c: AppContext) {
    try {
      const user = getUser(c);
      const invalid = await memberContextValidate(user, c);
      if (invalid) return invalid;
      const data = await DashboardService.ownerOverview(user.companyId as string);
      return HttpResponse(c).ok(data, undefined, 'Ringkasan dashboard owner');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }
}

export default new DashboardController();
