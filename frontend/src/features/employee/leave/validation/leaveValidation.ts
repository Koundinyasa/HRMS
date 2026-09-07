import { z } from "zod";

import {
  BACKDATE_ALLOWED_DAYS,
  MAX_REASON_LENGTH,
  isWeekendIso,
  minFromDateIso,
  maxApplyDateIso,
} from "../constants/leave.constants";

export const leaveApplySchema = z
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
    const totalDays =
      Math.floor(
        (new Date(data.toDate).getTime() -
          new Date(data.fromDate).getTime()) /
        (1000 * 60 * 60 * 24)
      ) + 1;

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

export type LeaveApplyFormData =
  z.infer<typeof leaveApplySchema>;


