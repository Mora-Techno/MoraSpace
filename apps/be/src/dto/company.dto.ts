import { t } from "elysia";
import { PaginationDto, SortDto, SearchDto } from "./filter.dto";

export const RegisterCompanyDto = t.Object({
  companyName: t.String({ minLength: 1, description: "Nama company" }),
  email: t.String({ format: "email", description: "Email leader" }),
  fullName: t.String({ minLength: 1, description: "Nama lengkap leader" }),
  password: t.String({ minLength: 6, description: "Password leader" }),
  tier: t.Optional(
    t.Union([t.Literal("free"), t.Literal("pro"), t.Literal("enterprise")], {
      description: "Tier langganan (default: free)",
    }),
  ),
});

export const CreateAdminDto = t.Object({
  email: t.String({ format: "email", description: "Email admin" }),
  fullName: t.String({ minLength: 1, description: "Nama lengkap admin" }),
  password: t.String({ minLength: 6, description: "Password admin" }),
});

export const UpdateSubscriptionDto = t.Object({
  tier: t.Union([t.Literal("free"), t.Literal("pro"), t.Literal("enterprise")]),
  billingCycle: t.Optional(
    t.Union([t.Literal("monthly"), t.Literal("yearly")]),
  ),
});

export const UpdateCompanyProfileDto = t.Object({
  logo: t.Optional(t.String({ description: "URL logo perusahaan" })),
  country: t.Optional(t.String({ description: "Negara perusahaan" })),
});

export const CompanyQueryDto = t.Object({
  ...SearchDto.properties,
  ...PaginationDto.properties,
  ...SortDto.properties,
  status: t.Optional(
    t.Union([t.Literal("active"), t.Literal("inactive")], {
      description: "Filter berdasarkan status admin",
    }),
  ),
});

export const CompanyParamsDto = t.Object({
  id: t.String({ description: "ID company" }),
});
