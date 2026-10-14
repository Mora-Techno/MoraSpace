import { t } from 'elysia';
import { PaginationDto, SearchDto } from './filter.dto';

export const ChatParamsDto = t.Object({
  id: t.String({ format: 'uuid', description: 'ID percakapan' }),
});

export const ChatMemberParamsDto = t.Object({
  id: t.String({ format: 'uuid', description: 'ID percakapan' }),
  userId: t.String({ format: 'uuid', description: 'ID user anggota' }),
});

export const OpenDirectDto = t.Object({
  userId: t.String({ format: 'uuid', description: 'ID user lawan bicara (satu company)' }),
});

export const CreateGroupDto = t.Object({
  name: t.String({ minLength: 1, maxLength: 100, description: 'Nama grup' }),
  description: t.Optional(t.String({ maxLength: 500, description: 'Deskripsi grup' })),
  memberUserIds: t.Array(t.String({ format: 'uuid' }), {
    maxItems: 50,
    description: 'ID user anggota awal (tanpa diri sendiri)',
  }),
});

export const UpdateGroupDto = t.Object({
  name: t.Optional(t.String({ minLength: 1, maxLength: 100, description: 'Nama grup' })),
  description: t.Optional(t.String({ maxLength: 500, description: 'Deskripsi grup' })),
});

export const ManageGroupMemberDto = t.Object({
  userId: t.String({ format: 'uuid', description: 'ID user target' }),
  role: t.Optional(
    t.Union([t.Literal('ADMIN'), t.Literal('MEMBER')], {
      description: 'Role baru (khusus ubah role, OWNER only)',
    }),
  ),
});

export const TransferOwnershipDto = t.Object({
  newOwnerId: t.String({ format: 'uuid', description: 'ID user pemilik baru' }),
});

export const ChatConversationQueryDto = t.Object({
  ...SearchDto.properties,
  ...PaginationDto.properties,
});

export const ChatMessagesQueryDto = t.Object({
  cursor: t.Optional(t.Numeric({ minimum: 0, description: 'seq acuan (before: lebih lama, after: lebih baru)' })),
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100, default: 30, description: 'Maks: 100' })),
  direction: t.Optional(
    t.Union([t.Literal('before'), t.Literal('after')], {
      default: 'before',
      description: 'before: riwayat lama (default), after: sinkronisasi terlewat',
    }),
  ),
});

export const ChatUserSearchQueryDto = t.Object({
  ...SearchDto.properties,
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 20, default: 10, description: 'Maks: 20' })),
});
