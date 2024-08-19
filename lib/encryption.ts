import { sign, verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_TOKEN ?? "0000000000"

export const createToken = (id: string, email: string, options?: object) => sign({
    id, email, options
}, JWT_SECRET)

export const verifyToken = (token: string) =>
    verify(token, JWT_SECRET,
        (error, data) =>
            ({ error, data })
    )

// console.log(verifyToken(createToken("123456", "asdfg@gmail.com")))