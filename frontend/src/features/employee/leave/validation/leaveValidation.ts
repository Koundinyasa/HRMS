

 
import { z } from "zod";
 
import {
  BACKDATE_ALLOWED_DAYS,
  MAX_REASON_LENGTH,
  isWeekendIso,
  minFromDateIso,
  maxApplyDateIso,
  countDaysExcludingHolidays, // 🔴 CHANGED (1 of 5): added import
} from "../constants/leave.constants";
 
// 🔴 CHANGED (2 of 5): schema is now a function that receives the holiday dates
export const makeLeaveApplySchema = (holidayIsos: Set<string>) => z
  .object({
    leaveType: z
      .string()
      .min(1, "Please select a leave type."),
 
    fromDate: z
      .string()
      .min(1, "From Date is required."),
 
    toDate: z
      .string()
      .min(1, "To Date is required."),
 
    // Optional: may be left empty, and any length is accepted.
    reason: z
      .string()
      .trim()
      .max(
        MAX_REASON_LENGTH,
        `Reason cannot exceed ${MAX_REASON_LENGTH} characters.`
      ),
 
    attachment: z.instanceof(File).nullable(),
 
    isHalfDay: z.boolean(),
 
    sessionFrom: z.string(),
 
    sessionTo: z.string(),
  })
  .refine(
    (data) => !isWeekendIso(data.fromDate),
    {
      path: ["fromDate"],
      message:
        "Weekends cannot be selected. Please choose a weekday.",
    }
  )
  .refine(
    (data) => !isWeekendIso(data.toDate),
    {
      path: ["toDate"],
      message:
        "Weekends cannot be selected. Please choose a weekday.",
    }
  )
  // 🔴 CHANGED (3 of 5): NEW -> reject a holiday as From Date
  .refine(
    (data) => !holidayIsos.has(data.fromDate),
    {
      path: ["fromDate"],
      message: "From Date is a holiday. Please choose a working day.",
    }
  )
  // 🔴 CHANGED (3 of 5): NEW -> reject a holiday as To Date
  .refine(
    (data) => !holidayIsos.has(data.toDate),
    {
      path: ["toDate"],
      message: "To Date is a holiday. Please choose a working day.",
    }
  )
  .refine(
    (data) => data.fromDate >= minFromDateIso(),
    {
      path: ["fromDate"],
      message: `You can select a date up to ${BACKDATE_ALLOWED_DAYS} days in the past.`,
    }
  )
  .refine(
    (data) => data.fromDate <= maxApplyDateIso(),
    {
      path: ["fromDate"],
      message: "You cannot apply more than 1 year in advance.",
    }
  )
  .refine(
    (data) => data.toDate <= maxApplyDateIso(),
    {
      path: ["toDate"],
      message: "You cannot apply more than 1 year in advance.",
    }
  )
  .refine(
    (data) => data.toDate >= data.fromDate,
    {
      path: ["toDate"],
      message:
        "To Date should be greater than or equal to From Date.",
    }
  )
 
  .refine(
    (data) =>
      new Date(data.fromDate).getFullYear() ===
      new Date().getFullYear(),
    {
      path: ["fromDate"],
      message:
        "Previous years are not allowed.",
    }
  )
  .refine(
    (data) =>
      new Date(data.toDate) >=
      new Date(`${new Date().getFullYear()}-01-01`) &&
      new Date(data.toDate) <=
      new Date(`${maxApplyDateIso()}T23:59:59`),
    {
      path: ["toDate"],
      message:
        "To Date cannot be before the current year or more than 1 year from today.",
    }
  )
  .superRefine((data, ctx) => {
    // 🔴 CHANGED (4 of 5): all days except holidays (weekend logic unchanged)
    const totalDays = countDaysExcludingHolidays(
      data.fromDate,
      data.toDate,
      holidayIsos
    );
 
    // Maternity Leave - Maximum 180 days
    if (
      data.leaveType === "4" &&
      totalDays > 180
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["toDate"],
        message:
          "Maternity Leave cannot exceed 180 days.",
      });
    }
 
    // Paternity Leave - Maximum 15 days
    if (
      data.leaveType === "5" &&
      totalDays > 15
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["toDate"],
        message:
          "Paternity Leave cannot exceed 15 days.",
      });
    }
 
    // Sick Leave - Attachment required if more than 1 day
    if (
      data.leaveType === "2" &&
      totalDays > 1 &&
      !data.attachment
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["attachment"],
        message:
          "Medical document is mandatory when Sick Leave exceeds 1 day.",
      });
    }
  });
 
// 🔴 CHANGED (5 of 5): NEW -> keeps old imports of leaveApplySchema working (no holidays)
export const leaveApplySchema = makeLeaveApplySchema(new Set());
 
export type LeaveApplyFormData =
  z.infer<typeof leaveApplySchema>;
 