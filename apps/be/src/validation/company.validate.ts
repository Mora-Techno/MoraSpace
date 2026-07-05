import { AppContext } from "@/contex";
import { HttpResponse } from "@/http";
import { PickCreateAdmin } from "@repo/types/auth.types";

export async function CreateAdminValidate(
  c: AppContext,
  input: PickCreateAdmin,
) {
  if (!input) {
    return HttpResponse(c).notFound("body Create Admin Dibutuhkan");
  }
}
