import type { AppContext } from '@/contex';
import { HttpResponse } from '@/http';
import type { PickCreateNote } from '@repo/types/note.types';

export async function CreateNoteValidation(c: AppContext, input: PickCreateNote) {
  if (!input) {
    return HttpResponse(c).notFound('body Create Music Dibutuhkan');
  }
}
