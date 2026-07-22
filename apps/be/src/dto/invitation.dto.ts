import { t } from "elysia";
import { PaginationDto, SearchDto } from "./filter.dto";

export const CreateInvitationDto = t.Object({
  email: t.String({
    format: "email",
    description: "Alamat email yang diundang",
  }),
  positionId: t.Optional(
    t.String({ format: "uuid", description: "ID jabatan opsional" }),
  ),
  roleId: t.Optional(
    t.String({ format: "uuid", description: "ID role opsional" }),
  ),
});

export const AcceptInvitationDto = t.Object({
  token: t.String({ minLength: 1, description: "Token undangan" }),
});

export const RejectInvitationDto = t.Object({
  token: t.String({ minLength: 1, description: "Token undangan" }),
});

export const InvitationQueryDto = t.Object({
  ...SearchDto.properties,
  ...PaginationDto.properties,
  status: t.Optional(
    t.Union(
      [t.Literal("pending"), t.Literal("accepted"), t.Literal("expired")],
      {
        description: "Filter berdasarkan status undangan",
      },
    ),
  ),
  positionId: t.Optional(
    t.String({
      format: "uuid",
      description: "Filter berdasarkan posisi/jabatan",
    }),
  ),
  startDate: t.Optional(
    t.String({
      format: "date-time",
      description: "Filter tanggal mulai (ISO 8601)",
    }),
  ),
  endDate: t.Optional(
    t.String({
      format: "date-time",
      description: "Filter tanggal akhir (ISO 8601)",
    }),
  ),
});

export const InvitationParamsDto = t.Object({
  id: t.String({ format: "uuid", description: "ID undangan" }),
});
