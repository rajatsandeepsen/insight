import { sjcetMailSchema } from "@/lib/email";
import { z } from "zod";

export const dataZod = z.array(z.object({
    email: z.string().email().or(sjcetMailSchema),
    name: z.string(),
    number: z.number(), // z.string().length(10),
    category: z.enum([
        "Intro to git and version control", 
        "Develop 3d website with three.js", 
        "Docker for DevOps & Self Hosting", 
        "GitHub actions & CI-CD Pipelines"
    ]),
    // checked: z.boolean(),
    // feedback: z.boolean()
    // token: z.string().optional(),
    // team: z.string().optional()
}))

export type CertificateZod = z.infer<typeof dataZod>

export const csvToJsonZod = z.array(z.object({
    number: z.number().min(999_999_999).transform(e => `${e}`),
    name: z.string(),
    email: z.string().email(),//sjcetMailSchema,
    // category: z.enum(["cicd", "docker", "git", "threejs", "none"]),
    // event_register_id: z.string()
    // team: z.string().optional(),
    // id: z.string().optional(),
}))