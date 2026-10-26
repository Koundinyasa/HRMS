import { z } from 'zod';

// POST leave/applyhr — employeeId comes from the page's employee selector, not a form field.
export const applyLeaveHrSchema = z
    .object({
        employeeId: z.string().min(1, 'Select an employee first'),
        leaveTypeId: z.string().min(1, 'Leave Type is required'),
        fromDate: z.string().min(1, 'From Date is required'),
        toDate: z.string().min(1, 'To Date is required'),
    })
    .refine((v) => v.toDate >= v.fromDate, {
        message: 'To Date cannot be before From Date',
        path: ['toDate'],
    });

export type ApplyLeaveHrFormValues = z.infer<typeof applyLeaveHrSchema>;
