import { AppContext } from "@/contex";
import { PickCreateEvent } from "@repo/types/calendar.types";
import { HttpResponse } from "@/http";

export async function CreateEventValidation(
  input: PickCreateEvent,
  c: AppContext,
) {
  if (!input) {
    return HttpResponse(c).badRequest("body Create Event Dibutuhkan");
  }
}
