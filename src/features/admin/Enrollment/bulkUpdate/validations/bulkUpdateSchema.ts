import { z } from "zod";

export const updateStatutorySchema = z.object({
    employeeIds: z.array(z.string()).min(1, "Select at least one employee"),
    month: z.string().min(1, "Month is required"),
    statutories: z.array(z.string()).min(1, "Select at least one statutory"),
    applicable: z.boolean().nullable(),
});

export type UpdateStatutoryFormValues = z.infer<typeof updateStatutorySchema>;