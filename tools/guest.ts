import { getDataFromMail } from "@/lib/email"
import { tool } from "ai"
import type { NeccessaryInfo } from "./index"
import { z } from "zod";

export const getGuestTools = (neccessaryInfo?: NeccessaryInfo) => {
    return {
        login: tool({
            description: 'Login to the INSIGHT system',
            parameters: z.object({
                collegeEmail: z.string().describe("College email address"),
                fullName: z.string().describe("Full name of the user")
            }),
            execute: async ({ collegeEmail }) => {
                if (!collegeEmail) return "Please provide your college email address to login"

                const { isSJCET, data } = getDataFromMail(collegeEmail)

                // const student = new Student(data,)


                if (!isSJCET || !data) return "You are not autherized to login. Need SJCET college Email ID"

                return `Hello ${data.college} 👋\n\nWelcome to INSIGHT SJCET\n\nLogined as ${data?.year !== "NA" ? "Student" : "Faculty\nContact Admin for Extra Insights"}\n\nOTP has been sent, paste it here to verify.`
            },
        }),

        OTP: tool({
			description: 'If prompt contains 6 digit OTP',
			parameters: z.object({
				number: z.number().min(99999).max(999999).describe("The 6 digit OTP")
			}),
			execute: async ({ number }) => {
				// if (number)

				return "OTP verified"

				// return `Hello ${data.name} 👋\n\nWelcome to INSIGHT SJCET\n\nLogined as ${data?.year !== "NA" ? "Student" : "Faculty\nContact Admin for Extra Insights"}`
			},
		}),

        actionNotAvailable: tool({
            description: 'If prompt includes any unavailable action to perform',
            parameters: z.object({
                actionName: z.string().describe("unavailable action name")
            }),
            execute: async ({ actionName }) =>  `Action: "${actionName}" is not available. Please login to get access to more Functionalities`
        })
    }
}