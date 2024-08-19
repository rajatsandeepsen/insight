import type { AllRoles } from "@/lib/type";
import { model } from "@/model";
import { generateText, type CoreTool } from "ai";
import type { Message } from "whatsapp-web.js";
import { getGuestTools } from "./guest";
import { getCommonTools } from "./sjcet";
import { getStudentsTools } from "./student";
import { getAllUserTools } from "./user";


export type TOOLS = Record<string, CoreTool>

export type NeccessaryInfo = {
} & Awaited<ReturnType<Message["getContact"]>>

export type ToolBaseData = {
    role: AllRoles,
    number: string,
}

export const generateTools = async (toolBaseData: ToolBaseData) => {
    const { role } = toolBaseData

    const tools = {
        ...role === "NA" ? getGuestTools(toolBaseData) : getAllUserTools(toolBaseData),
        ...role === "student" ? getStudentsTools() : {},
        
    } as ReturnType<typeof getGuestTools>

    Object.assign(tools, getCommonTools(Object.keys(tools), toolBaseData))

    return async (options: Partial<Parameters<typeof generateText>[0]>) => await generateText({
        ...options,
        model,
        toolChoice: "auto",
        tools,
    })

}