import JWT,{ type JwtPayload, type VerifyErrors } from "jsonwebtoken";
import { z } from "zod";
const {sign, verify} =JWT

const JWT_SECRET = process.env.JWT_TOKEN ?? "0000000000"

export const createToken = (id: string, email: string, options?: object) => sign({
    id, email, ...options
}, JWT_SECRET)

type info<T> = { error: null, data: T } | { error: VerifyErrors, data: JwtPayload & T }

export const verifyToken = <T>(token: string) =>
    verify(token, JWT_SECRET,
        (error, data) => ({ error, data })) as unknown as info<T>

export const tokenDataZod = z.object({
    id: z.string(),
    email: z.string().email().refine(e => e.endsWith("sjcetpalai.ac.in"), {message: "Use SJCET College Email id"}),
    event: z.object({
        title: z.string(),
        organisedBy: z.string(),
        activityPoints: z.number().min(0),
        description: z.string(),
        link: z.string().url(),
    })
})

export type TokenData = z.infer<typeof tokenDataZod>


// const token = createToken("insendium-24", "asdfg2025@ai.sjcetpalai.ac.in", {
//     event: {
//         "title": "INSENDIUM 2024",
//         "organisedBy": "IEDC",
//         "activityPoints": 5,
//         "description": "an ideation workshop for young entrepreneurs & innovators",
//         "link": "instagram link"
//     }
// })

// console.log(token)

// const data = verifyToken(token)
// console.log(data)


// console.log(await getResponse(JSON.stringify(data), ``))
