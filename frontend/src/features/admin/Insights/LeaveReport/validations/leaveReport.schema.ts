// leaveReport.schema.ts
import { z } from "zod";

export const reportFilterSchema = z.object({
  search: z.string().optional().default(""),
  query: z.string().optional(),
  branch: z.string().optional(),
  salaryStructure: z.string().optional(),
  leave: z.string().optional(),
  attendance: z.string().optional(),
  designation: z.string().optional(),
  empStatus: z.string().optional(),
});

export const monthRangeSchema = z
  .object({
    fromMonth: z.string().min(1, "From Month is required"),
    toMonth: z.string().min(1, "To Month is required"),
  })
  .refine(
    (data) => {
      const parse = (m: string) => {
        const [mon, year] = m.split("/");
        const months = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];
        return new Date(Number(year), months.indexOf(mon), 1);
      };
      return parse(data.fromMonth) <= parse(data.toMonth);
    },
    {
      message: "From Month must be before or equal to To Month",
      path: ["toMonth"],
    }
  );

export const groupByLeavePolicySchema = z.object({
  employeeLeavePolicy: z.boolean().default(false),
  internLeavePolicy: z.boolean().default(false),
});

export const leaveReportRequestSchema = monthRangeSchema.and(
  z.object({
    filters: reportFilterSchema,
    groupBy: groupByLeavePolicySchema,
    page: z.number().int().positive().default(1),
    pageSize: z.number().int().positive().default(10),
  })
);

export type LeaveReportRequest = z.infer<typeof leaveReportRequestSchema>;