import { t } from 'elysia';

export const CreateInvitationDto = t.Object({
  email: t.String({ format: 'email', description: 'Alamat email yang diundang' }),
  positionId: t.Optional(t.String({ format: 'uuid', description: 'ID jabatan opsional' })),
  roleId: t.Optional(t.String({ format: 'uuid', description: 'ID role opsional' })),
});

export const AcceptInvitationDto = t.Object({
  token: t.String({ minLength: 1, description: 'Token undangan' }),
});

export const RejectInvitationDto = t.Object({
  token: t.String({ minLength: 1, description: 'Token undangan' }),
});

export const InvitationParamsDto = t.Object({
  id: t.String({ format: 'uuid', description: 'ID undangan' }),
});
