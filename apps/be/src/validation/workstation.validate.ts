import type { AppContext } from '@/contex';
import type { PickCreateWorkstation } from '@repo/types/workstation.types';
import { HttpResponse } from '@/http';

export async function CreateWorkStationValidate(c: AppContext, input: PickCreateWorkstation) {
  if (!input) {
    return HttpResponse(c).badRequest();
  }
}
