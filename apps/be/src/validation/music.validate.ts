import type { AppContext } from '@/contex';
import { HttpResponse } from '@/http';
import type { PickCreatePlaylist } from '@repo/types/music.types';

export async function CreateMusicValidate(c: AppContext, input: PickCreatePlaylist) {
  if (!input) {
    return HttpResponse(c).notFound('body Create Music Dibutuhkan ');
  }
}
