// frontend/src/features/admin/admincenter/appliedLeave/validation/appliedLeaveValidation.ts

import { z } from "zod";

import {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  MAX_REASON_LENGTH,
  MATERNITY_LEAVE_ID,
  MATERNITY_MAX_DAYS,
  PATERNITY_LEAVE_ID,
  PATERNITY_MAX_DAYS,
} from "../constants/appliedLeave.constants";

export const appliedLeaveSchema =
  z
    .object({
      leaveType: z
        .string()
        .min(
          1,
          "Please select leave type",
        ),

      fromDate: z
        .string()
        .min(
          1,
          "Please select from date",
        ),

      toDate: z
        .string()
        .min(
          1,
          "Please select to date",
        ),

      reason: z
        .string()
        .max(
          MAX_REASON_LENGTH,
          `Reason cannot exceed ${MAX_REASON_LENGTH} characters`,
        )
        .optional()
        .or(z.literal("")),

      isHalfDay: z.boolean(),

      sessionFrom: z.string(),

      sessionTo: z.string(),

      attachment: z
        .instanceof(File)
        .nullable()
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (
        data.fromDate &&
        data.toDate
      ) {
        const from = new Date(
          `${data.fromDate}T00:00:00`,
        );

        const to = new Date(
          `${data.toDate}T00:00:00`,
        );

        if (to < from) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["toDate"],
            message:
              "To Date cannot be before From Date",
          });
        }

        const totalDays =
          Math.floor(
            (to.getTime() -
              from.getTime()) /
              (1000 *
                60 *
                60 *
                24),
          ) + 1;

        if (
          data.leaveType ===
            MATERNITY_LEAVE_ID &&
          totalDays >
            MATERNITY_MAX_DAYS
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["toDate"],
            message:
              `Maternity leave cannot exceed ${MATERNITY_MAX_DAYS} days`,
          });
        }

        if (
          data.leaveType ===
            PATERNITY_LEAVE_ID &&
          totalDays >
            PATERNITY_MAX_DAYS
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["toDate"],
            message:
              `Paternity leave cannot exceed ${PATERNITY_MAX_DAYS} days`,
          });
        }
      }

      if (
        data.isHalfDay &&
        !data.sessionFrom
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["sessionFrom"],
          message:
            "Please select half day session",
        });
      }

      if (data.attachment) {
        if (
          data.attachment.size >
          MAX_FILE_SIZE
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["attachment"],
            message:
              "File size cannot exceed 5 MB",
          });
        }

        if (
          !ALLOWED_FILE_TYPES.includes(
            data.attachment.type,
          )
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["attachment"],
            message:
              "Only PDF, JPG, PNG, DOC and DOCX files are allowed",
          });
        }
      }
    });

export type AppliedLeaveForm =
  z.infer<typeof appliedLeaveSchema>;