import { sjcetMailSchema } from "@/lib/email";
import { z } from "zod";

export const dataZod = z.array(z.object({
    email: sjcetMailSchema,
    name: z.string(),
    number: z.string().length(10),
    token: z.string()
}))

export type CertificateZod = z.infer<typeof dataZod>

export const csvToJsonZod = z.array(z.object({
    number: z.number().min(999_999_999).transform(e => `${e}`),
    name: z.string(),
    email: sjcetMailSchema,
}))