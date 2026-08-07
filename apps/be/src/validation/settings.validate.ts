import { AppContext } from "@/contex";
import { HttpResponse } from "@/http";
import { TestEmail } from "@repo/types/settings.types";

export async function TestEmailValidation(c: AppContext, input: TestEmail) {
  if (!input) {
    return HttpResponse(c).notFound("body testing Email Dibutuhkan");
  }
}
