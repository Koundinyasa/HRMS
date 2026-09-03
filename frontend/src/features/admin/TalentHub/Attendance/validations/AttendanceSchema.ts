// attendance.validation.ts
import { z } from 'zod';

// ---- Create Attendance Configuration ----
export const createAttendanceSchema = z.object({
  attendanceName: z
    .string()
    .trim()
    .min(1, 'Attendance name is required')
    .max(100, 'Attendance name must be under 100 characters'),

  shortName: z
    .string()
    .trim()
    .min(1, 'Short name is required')
    .max(20, 'Short name must be under 20 characters'),

  salaryCalendarDayId: z
    .number({ message: 'Salary calendar day is required' })
    .int()
    .positive('Select a valid salary calendar day'),

  attendanceTypeId: z
    .number({ message: 'Attendance type is required' })
    .int()
    .positive('Select a valid attendance type'),

  independent: z.boolean(),
  ot2Enable: z.boolean(),
  overtime: z.boolean(),
  lateInEarlyOut: z.boolean(),
});

export type CreateAttendanceFormValues = z.infer<typeof createAttendanceSchema>;

// ---- Attendance Integration ----
export const attendanceIntegrationSchema = z
  .object({
    description: z
      .string()
      .trim()
      .min(1, 'Description is required')
      .max(255, 'Description must be under 255 characters'),

    integrationTypeId: z
      .number({ message: 'Integration type is required' })
      .int()
      .positive('Select a valid integration type'),

    url: z
      .string()
      .trim()
      .url('Enter a valid URL')
      .optional()
      .or(z.literal('')),

    userName: z.string().trim().max(100).optional(),
    password: z.string().trim().max(100).optional(),

    applicableAttendanceId: z
      .number({ message: 'Applicable attendance is required' })
      .int()
      .positive('Select a valid applicable attendance'),

    present: z.string().trim().max(20).optional(),
    absent: z.string().trim().max(20).optional(),
    weeklyOff: z.string().trim().max(20).optional(),
    holiday: z.string().trim().max(20).optional(),

    skipHolidays: z.boolean().optional(),

    autoIntegrationHours: z
      .number()
      .min(0, 'Hours cannot be negative')
      .max(24, 'Hours cannot exceed 24')
      .optional(),

    calculateOTId: z.number().int().positive().optional(),

    refNo: z.string().trim().max(50).optional(),
    processDate: z.string().trim().optional(),
    firstHalf: z.string().trim().max(20).optional(),
    secondHalf: z.string().trim().max(20).optional(),
    otUnits: z.string().trim().max(20).optional(),
  })
  // if url is provided, userName + password become required (typical for API-based integrations)
  .refine(
    (data) => !data.url || (data.userName && data.password),
    {
      message: 'Username and password are required when a URL is provided',
      path: ['userName'],
    }
  );

export type AttendanceIntegrationFormValues = z.infer<typeof attendanceIntegrationSchema>;

// ---- Reconcile Leave Update ----
export const reconcileLeaveEmployeeSchema = z.object({
  employeeId: z
    .number({ message: 'Employee is required' })
    .int()
    .positive('Select a valid employee'),

  date: z
    .string()
    .trim()
    .min(1, 'Date is required')
    .refine((val) => !isNaN(Date.parse(val)), 'Enter a valid date'),
});

export const reconcileLeaveUpdateSchema = z.object({
  leaveTypeId: z
    .number({ message: 'Leave type is required' })
    .int()
    .positive('Select a valid leave type'),

  employees: z
    .array(reconcileLeaveEmployeeSchema)
    .min(1, 'Select at least one employee'),
});

export type ReconcileLeaveUpdateFormValues = z.infer<typeof reconcileLeaveUpdateSchema>;