import { z }  from "zod"

export const companySchema = z.object({
    companyName: z.string().min(1,"Company name is required"),
    establishment:z.string().optional(),
    cin:z.string().optional(),
    tan:z.string().optional(),
    website:z.string().url("Enter  vaild URL").optional().or(z.literal("")),
    address1: z.string().min(1, "Address 1 is required"),
    address2: z.string().optional(),
    address3: z.string().optional(),
    phone1: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
    phone2: z.string().regex(/^\d{10}$/).optional().or(z.literal("")),
    shortName: z.string().optional(),
    pf: z.boolean(),
    esi: z.boolean(),
    pt: z.boolean(),
    tds: z.boolean(),
    tdsEfilingMarToFeb: z.boolean(),
    lwf: z.boolean(),
})


export type CompanyFormValues =z.infer<typeof companySchema>;



export const companyDocumentSchema = z.object({
  file: z
    .instanceof(File)
    .refine((f) => ["image/png", "image/jpeg", "application/pdf"].includes(f.type), "Unsupported file type")
    .refine((f) => f.size <= 5 * 1024 * 1024, "Max file size is 5MB"),
  description: z.string().optional(),
});


export type CompanyFormDocuments =z.infer<typeof companyDocumentSchema>;