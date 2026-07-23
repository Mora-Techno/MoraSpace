import { t } from "elysia";
import { PaginationDto, SearchDto } from "./filter.dto";

export const SubscriptionQueryDto = t.Object({
  ...SearchDto.properties,
  ...PaginationDto.properties,
  status: t.Optional(
    t.Union(
      [
        t.Literal("active"),
        t.Literal("inactive"),
        t.Literal("expired"),
        t.Literal("cancelled"),
      ],
      {
        description: "Filter berdasarkan status langganan",
      },
    ),
  ),
  planId: t.Optional(
    t.String({ format: "uuid", description: "Filter berdasarkan paket" }),
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

export const CreateCheckoutDto = t.Object({
  tier: t.Union([t.Literal("free"), t.Literal("pro"), t.Literal("enterprise")]),
  billingCycle: t.Union([t.Literal("monthly"), t.Literal("yearly")]),
  provider: t.Union([t.Literal("stripe"), t.Literal("xendit")]),
});
