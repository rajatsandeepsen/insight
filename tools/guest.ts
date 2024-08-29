import { getDataFromMail } from "@/lib/email"
import { tool } from "ai"
import type { ToolBaseData } from "./index"
import { z } from "zod";
import { User } from "@/cache/user";
import { convertLabels } from "@/lib/chat";
import { client } from "@/source/client";

export const getGuestTools = (toolBaseData: ToolBaseData) => {
    const { number, chat } = toolBaseData

    return {
        login: tool({
            description: 'Authenticate into the system with email id',
            parameters: z.object({
                email: z.string().email().describe("Email address of user"),
            }),
            execute: async ({ email }) => {
                if (!email) return "Please provide your college email address to login"

                const { isSJCET, data } = getDataFromMail(email)

                if (!isSJCET || !data) return "You are not autherized to login. Need SJCET college Email ID"

                const student = new User(data, number)
                const res = await User.createAccount(student.data, number)

                if (res) {
                    const { name } = student.data

                    return `Hi ${name} 👋\n\nOTP has been sent to your email, paste it here to verify.`
                }

                return "Something wrong with Authentication"
            },
        }),

        verifyOTP: tool({
            description: 'Only If user prompt contains 6 digit number (OTP) to verify the login process',
            parameters: z.object({
                otp: z.number().min(99999).max(999999).describe("The 6 digit OTP")
            }),
            execute: async ({ otp }) => {
                const student = await User.verify({ otp, phone: number })

                if (student) {
                    const labels = await client.getLabels()
                    const newL = convertLabels(labels, student.data)
                    chat.changeLabels(newL)
                        .then(e => console.log("Labels changed", newL))
                        .catch(e => console.log("Label Error", e))
                    return `Welcome ${student.data.name} 👋\n\n OTP is verified ✅\nLogined as ${student.data.role}`
                }

                return `Something wrong, Please paste correct OTP from mail`
            },
        }),
    }
}