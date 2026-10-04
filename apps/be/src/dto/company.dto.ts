import { t } from 'elysia';
import { PaginationDto, SortDto, SearchDto } from './filter.dto';

export const RegisterCompanyDto = t.Object({
  companyName: t.String({ minLength: 1, description: 'Nama company' }),
  email: t.String({ format: 'email', description: 'Email leader' }),
  fullName: t.String({ minLength: 1, description: 'Nama lengkap leader' }),
  password: t.String({ minLength: 6, description: 'Password leader' }),
  tier: t.Optional(
    t.Union([t.Literal('free'), t.Literal('pro'), t.Literal('enterprise')], {
      description: 'Tier langganan (default: free)',
    }),
  ),
});

export const CreateAdminDto = t.Object({
  email: t.String({ format: 'email', description: 'Email admin' }),
  fullName: t.String({ minLength: 1, description: 'Nama lengkap admin' }),
  password: t.String({ minLength: 6, description: 'Password admin' }),
});

export const UpdateSubscriptionDto = t.Object({
  tier: t.Union([t.Literal('free'), t.Literal('pro'), t.Literal('enterprise')]),
  billingCycle: t.Optional(t.Union([t.Literal('monthly'), t.Literal('yearly')])),
});

export const UpdateCompanyProfileDto = t.Object({
  logo: t.Optional(t.String({ description: 'URL logo perusahaan' })),
  country: t.Optional(t.String({ description: 'Negara perusahaan' })),
});

// v0.0.1: Working Hours — GET semua member, PATCH Owner only.
export const UpdateCompanySettingsDto = t.Object({
  workingHourStart: t.Optional(t.String({ description: 'Jam mulai (HH:mm)' })),
  workingHourEnd: t.Optional(t.String({ description: 'Jam selesai (HH:mm)' })),
  workDays: t.Optional(t.String({ description: 'Hari kerja, mis. mon,tue,wed,thu,fri' })),
  respectWorkingHours: t.Optional(t.Boolean()),
  queueNotification: t.Optional(t.Boolean()),
});

export const CompanyQueryDto = t.Object({
  ...SearchDto.properties,
  ...PaginationDto.properties,
  ...SortDto.properties,
  status: t.Optional(
    t.Union([t.Literal('active'), t.Literal('inactive')], {
      description: 'Filter berdasarkan status admin',
    }),
  ),
});

export const CompanyParamsDto = t.Object({
  id: t.String({ description: 'ID company' }),
});

// v0.0.1 Layer 1: Super Admin buat company manual (reuse registerLeader).
export const CreateCompanyAdminDto = t.Object({
  name: t.String({ minLength: 1, description: 'Nama company' }),
  ownerEmail: t.String({ format: 'email', description: 'Email owner' }),
  ownerFullName: t.String({ minLength: 1, description: 'Nama lengkap owner' }),
  ownerPassword: t.Optional(
    t.String({ minLength: 6, description: 'Password owner (auto-generate bila kosong)' }),
  ),
  tier: t.Optional(t.Union([t.Literal('free'), t.Literal('pro'), t.Literal('enterprise')])),
});
