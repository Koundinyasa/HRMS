import { z } from 'zod';

export const initiateBgvSchema = z.object({
    candidateIds: z.array(z.string()).min(1, 'Select at least one candidate'),
});

export type InitiateBgvFormValues = z.infer<typeof initiateBgvSchema>;

export const assignVerifierSchema = z.object({
    candidateIds: z.array(z.string()).min(1, 'Select at least one candidate'),
    externalVerifier: z.string().min(1, 'External Verifier is required'),
    activities: z.string().optional(),
});

export type AssignVerifierFormValues = z.infer<typeof assignVerifierSchema>;

export const verificationItemSchema = z.object({
    verificationType: z.string(),
    verificationDate: z.string().optional(),
    status: z.enum(['new', 'pending', 'verified', 'rejected']),
});

export const updateOngoingBgvSchema = z.object({
    overallStatus: z.enum(['pending', 'in_progress', 'completed', 'discrepancy']).optional(),
    externalVerifier: z.string().optional(),
    activities: z.string().optional(),
    verifications: z.array(verificationItemSchema).optional(),
});

export type UpdateOngoingBgvFormValues = z.infer<typeof updateOngoingBgvSchema>;

export const verificationTypeSettingSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    enabled: z.boolean(),
});

export const createVerificationTypeSchema = z.object({
    name: z.string().min(1, 'Name is required'),
});

export type CreateVerificationTypeFormValues = z.infer<typeof createVerificationTypeSchema>;

export const mailTemplateSchema = z.object({
    type: z.enum(['consent', 'external_verification', 'employment_verification']),
    subject: z.string().min(1, 'Subject is required'),
    body: z.string().min(1, 'Body is required'),
});

export const bgvSettingsSchema = z.object({
    verificationTypes: z.array(verificationTypeSettingSchema),
    requireExternalVerifier: z.boolean(),
    mailTemplates: z.array(mailTemplateSchema),
});

export type BgvSettingsFormValues = z.infer<typeof bgvSettingsSchema>;