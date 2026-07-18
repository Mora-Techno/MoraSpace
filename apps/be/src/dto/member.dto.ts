import { t } from 'elysia';

export const CompanyMemberStatusEnum = t.Union([
  t.Literal('active'),
  t.Literal('inactive'),
  t.Literal('pending'),
  t.Literal('resigned'),
]);

export const UpdateMemberDto = t.Object({
  employeeCode: t.Optional(t.Nullable(t.String({ description: 'Kode karyawan' }))),
  positionId: t.Optional(
    t.Nullable(t.String({ format: 'uuid', description: 'ID posisi/jabatan' })),
  ),
  employmentTypeId: t.Optional(
    t.Nullable(t.String({ format: 'uuid', description: 'ID tipe kepegawaian' })),
  ),
  status: t.Optional(CompanyMemberStatusEnum),
  joinedAt: t.Optional(
    t.Nullable(t.String({ format: 'date-time', description: 'Tanggal bergabung' })),
  ),
  resignedAt: t.Optional(
    t.Nullable(t.String({ format: 'date-time', description: 'Tanggal keluar' })),
  ),
});

export const UpdateMemberProfileDto = t.Object({
  gender: t.Optional(t.Nullable(t.String({ description: 'Jenis kelamin' }))),
  birthday: t.Optional(t.Nullable(t.String({ format: 'date-time', description: 'Tanggal lahir' }))),
  address: t.Optional(t.Nullable(t.String({ description: 'Alamat tempat tinggal' }))),
  emergencyContact: t.Optional(t.Nullable(t.String({ description: 'Kontak darurat' }))),
  bio: t.Optional(t.Nullable(t.String({ description: 'Biografi singkat' }))),
});

export const MemberContactItemDto = t.Object({
  type: t.String({ minLength: 1, description: 'Tipe kontak (email, phone, linkedin, dll)' }),
  value: t.String({ minLength: 1, description: 'Nilai kontak' }),
});

export const UpdateMemberContactsDto = t.Object({
  contacts: t.Array(MemberContactItemDto, { description: 'Daftar kontak' }),
});

export const MemberParamsDto = t.Object({
  id: t.String({ format: 'uuid', description: 'ID anggota (company member ID)' }),
});
