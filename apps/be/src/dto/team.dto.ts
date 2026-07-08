import { t } from 'elysia';

export const CreateTeamDto = t.Object({
  departmentId: t.String({ format: 'uuid', description: 'ID departemen' }),
  name: t.String({ minLength: 1, description: 'Nama tim' }),
  description: t.Optional(t.String({ description: 'Deskripsi tim' })),
  leaderId: t.Optional(t.String({ format: 'uuid', description: 'ID leader (user ID)' })),
});

export const UpdateTeamDto = t.Object({
  name: t.Optional(t.String({ minLength: 1, description: 'Nama tim baru' })),
  description: t.Optional(t.Nullable(t.String({ description: 'Deskripsi tim baru' }))),
  leaderId: t.Optional(t.Nullable(t.String({ format: 'uuid', description: 'ID leader baru' }))),
});

export const TeamParamsDto = t.Object({
  id: t.String({ format: 'uuid', description: 'ID tim' }),
});

export const TeamMemberParamsDto = t.Object({
  id: t.String({ format: 'uuid', description: 'ID tim' }),
  memberId: t.String({ format: 'uuid', description: 'ID anggota (company member ID)' }),
});

export const AddTeamMemberDto = t.Object({
  companyMemberId: t.String({ format: 'uuid', description: 'ID anggota (company member ID)' }),
  isLeader: t.Optional(t.Boolean({ description: 'Status leader di tim' })),
});

export const TeamQueryDto = t.Object({
  departmentId: t.Optional(t.String({ format: 'uuid', description: 'Filter berdasarkan departemen' })),
});
