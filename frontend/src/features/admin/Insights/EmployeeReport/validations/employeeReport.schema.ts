// employeeReport.schema.ts
import { z } from "zod";

export const reportFilterSchema = z.object({
  search: z.string().optional().default(""),
  fromDate: z.string().optional().default(""),
  toDate: z.string().optional().default(""),
  status: z.array(z.string()).optional().default([]),
});

export const dateRangeSchema = z
  .object({
    fromDate: z.string().min(1, "From Date is required"),
    toDate: z.string().min(1, "To Date is required"),
  })
  .refine((data) => new Date(data.fromDate) <= new Date(data.toDate), {
    message: "From Date must be before or equal to To Date",
    path: ["toDate"],
  });

export const employeeReportRequestSchema = z.object({
  filters: reportFilterSchema,
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
});

export type EmployeeReportRequest = z.infer<typeof employeeReportRequestSchema>;