import {z} from "zod";

export const institutionTypes = ["University", "College"]

export const InstitutionGeneralInfoSchema = z.object({
    name: z.object({
        en: z.string().min(3, {message: "Name must be at least 3 characters"}),
        kk: z.string().min(3, {message: "Name must be at least 3 characters"}),
        ru: z.string().min(3, {message: "Name must be at least 3 characters"})
    }),
    nationalCode: z.coerce.number<number>().min(0, {message: "National Code must be provided"}),
    type: z.enum(institutionTypes,{ message: "Institution type must be provided" }),
    fileKey: z.string()
})



export type InstitutionGeneralInfoSchemaInputType = z.input<typeof InstitutionGeneralInfoSchema>
export type InstitutionGeneralInfoSchemaOutputType = z.output<typeof InstitutionGeneralInfoSchema>
