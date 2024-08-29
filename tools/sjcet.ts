import type { User } from "@/cache/user";
import JsonDataAboutSJCET from "@/data/new.sjcet.json";
import { allDepartments } from "@/lib/type";
import { getResponse } from "@/source/model";
import { tool } from "ai";
import { z } from "zod";
import type { ToolBaseData } from "./index";



export const system = "You are a helpful and talkative whatsapp bot named 'Insight', built for users at SJCET Palai college. Respond to prompt like human, incorporate more emojis into the responses and invoke tools only if need."
export const systemGetINfo = "You are helping to extract useful information to anwser the given question. End generation after anwsering the question"

const userInfo = ({ department, email, name, year, role }: User["data"]) =>
    `Info about user: 
name: ${name}
department: ${allDepartments[department]}
year: ${year}
role: ${role}
email: ${email}
Auth status: logged in
`

export const getUserInfo = (user?: User["data"], quote?: string) => `Information about User:
${user ? `${userInfo(user)}` : "User haven't logged into the system yet. Maybe ask user to login & access more functionalities"}`

export const newestDataAboutSJCET = JsonDataAboutSJCET as string[]

export const aboutSJCET = `St. Joseph's College of Engineering and Technology (SJCET), Palai is a private engineering college located in Pala, Kerala, India. 
It was established in 2002 by the Diocesan Technical Education Trust of the Catholic Diocese of Palai and is affiliated with Mahatma Gandhi University, Kottayam and APJ Abdul Kalam Technological University. 
SJCET Palai is approved by the All India Council for Technical Education (AICTE) and offers professional degree programs in engineering and management.

website: https://www.sjcetpalai.ac.in/
Address: Choondacherry, Palai, Kerala 686579
Principal: Dr. V. P. Devassia
`

export const questionTemaplate = (questions: string) => `Data: ${aboutSJCET} 

Newest Information: ${newestDataAboutSJCET.join("\n")}

Instruction: Answer the following questions from above data. If question is not about SJCET, just say "Im not created for these kind of messages"

User's Question: ${questions}
Anwser: `

export const getCommonTools = (toolBaseData: ToolBaseData) => {
    return {
        // chat: tool({
        //     description: 'reply to user messages',
        //     parameters: z.object({
        //         reply: z.string().describe("reply to user's normal messages"),
        //         userMessage: z.string().describe("User's message")
        //     }),
        //     execute: async ({ reply, userMessage }) => {
        //         console.log("Conv:", userMessage, reply)

        //         // // const prompt = questionTemaplate(question)
        //         // const res = await getResponse(reply, system)

        //         return reply
        //     },
        // }),
        getInformation: tool({
            description: 'Get answers for any questions/information about SJCET college',
            parameters: z.object({
                question: z.string().describe("The question or the information looking for")
            }),
            execute: async ({ question }) => {
                console.log("Searching for:", question)

                const prompt = questionTemaplate(question)
                const res = await getResponse(prompt, systemGetINfo)

                return res
            },
        }),

        getEvents: tool({
            description: 'Get events details happening/upcoming in SJCET college',
            parameters: z.object({
                eventName: z.string().optional().describe("About a specific event")
            }),
            execute: async ({ eventName }) => {

                return `${eventName}... ath kazhinj poyi.. hahaha`
            },
        }),

        actionNotAvailable: tool({
            description: 'When user asks to perform actions not available in the system',
            parameters: z.object({
                actionName: z.string().describe("unavailable action name")
            }),
            execute: async ({ actionName }) => `Action: "${actionName}" is not available`
        }),
    }
}