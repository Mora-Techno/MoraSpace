import type { AppContext } from '@/contex';
import { HttpResponse } from '@/http';
import type { PickSendNotification } from '@repo/types/notification.types';

export async function SendNotifValidation(c: AppContext, input: PickSendNotification) {
  if (!input) {
    return HttpResponse(c).notFound('body Create Send Dibutuhkan');
  }
}
