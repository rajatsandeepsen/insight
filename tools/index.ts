import type { AllRoles } from "@/lib/type";
import { model } from "@/source/model";
import { generateText, tool, type CoreTool } from "ai";
import type { Message } from "whatsapp-web.js";
import { getGuestTools } from "./guest";
import { getCommonTools } from "./sjcet";
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
}

export const generateTools = async (toolBaseData: ToolBaseData, user?: User) => {
    const { role, number } = toolBaseData

    const tools = {
        ...role === "NA" ? getGuestTools(toolBaseData) : getAllUserTools(toolBaseData),
        ...role === "student" ? getStudentsTools() : {},

    } as ReturnType<typeof getGuestTools>

    const toolKeys = Object.keys(tools)
    Object.assign(tools, getCommonTools(toolKeys, toolBaseData))

    return async (options: Partial<Parameters<typeof generateText>[0]>) => await generateText({
        ...options,
        model,
        toolChoice: "auto",
        tools: {
            invokeActions: tool({
                description: `When user asks execute some functionalies like "${toolKeys.join(", ")}"`,
                parameters: z.object({
                    action: z.string().describe("action name to execute"),
                    availableData: z.record(z.string()).describe("Usefull data about user from previous messages")
                }),
                execute: async ({ action, availableData }) => {

                    return "Working on it"
                }
            })
        },
    })

}