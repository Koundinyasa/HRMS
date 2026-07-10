import { z } from 'zod';

export const salaryFilterSchema = z.object({
  month: z.string().optional(),
  year: z.string().optional(),
});

export type SalaryFilterFormData = z.infer<typeof salaryFilterSchema>;