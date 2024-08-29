import type { AllRoles } from "@/lib/type";
import { model } from "@/source/model";
import { generateText, tool, type CoreTool } from "ai";
import type { Chat, Message } from "whatsapp-web.js";
import { getGuestTools } from "./guest";
import { getCommonTools, system } from "./sjcet";
import { getStudentsTools } from "./student";
import { getAllUserTools } from "./user";
import type { User } from "@/cache/user";
import { z } from "zod";


export type TOOLS = Record<string, CoreTool>

export type NeccessaryInfo = {
} & Awaited<ReturnType<Message["getContact"]>>

export type ToolBaseData = {
    role: AllRoles,
    number: string,
    chat: Chat
}

export const generateTools = async (toolBaseData: ToolBaseData, user?: User) => {
    const { role, number } = toolBaseData

    const tools = {
        ...role === "NA" ? getGuestTools(toolBaseData) : getAllUserTools(toolBaseData),
        ...role === "student" ? getStudentsTools() : {},

    } as ReturnType<typeof getGuestTools>

    const someToolKeys = Object.keys(tools)
    Object.assign(tools, getCommonTools(someToolKeys, toolBaseData))
    const toolKeys = Object.keys(tools)

    console.log("T:", toolKeys.join(", "))
    
    return async (options: Partial<Parameters<typeof generateText>[0]>) => await generateText({
        ...options,
        system,
        model,
        toolChoice: "auto",
        tools
//         tools: {
//             invokeActions: tool({
//                 description: `When user asks execute some functionalies like ${toolKeys.join(", ")}`,
//                 parameters: z.object({
//                     // @ts-ignore
//                     actionName: z.enum(toolKeys).describe("action name to execute"),
//                     availableData: z.record(z.string()).describe("Any usefull data about user from previous messages")
//                 }),
//                 execute: async ({ actionName, availableData }) => {
//                     console.log("actionName", actionName)
//                     console.log("availableData", availableData)
//                     const res = await generateText({
//                         model,
//                         toolChoice: "auto",
//                         tools,
//                         system: `You are provided with tools and required parameters for it.
// Your purpose is to utilize available data and invoke the correct tool from prompt.

// If data doen't contain all required keys, then respond "I can't complete the <actionName> process without knowing <keys>. Can you provide more informations?"`,
//                         prompt: `tool: "${actionName}
// Available data: ${JSON.stringify(availableData, null, 2)}`
//                     })

//                     return res
//                 }
//             })
//         },
    })

}