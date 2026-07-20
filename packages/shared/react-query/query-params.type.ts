import { z } from 'zod';

export const requiredString = z.string().trim().min(1, 'Required');

export const pageFilterTypeSchema = z.number().optional();
export const rowsFilterTypeSchema = z.number().optional();

export const queryParamsSchema = z.object({
  page: pageFilterTypeSchema,
  rows: rowsFilterTypeSchema,
});

export type QueryParams = z.infer<typeof queryParamsSchema>;
