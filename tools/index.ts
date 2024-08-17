import type { AllRoles } from "@/lib/type";
import { generateText, type CoreTool } from "ai";
import type { Chat, Client, Message } from "whatsapp-web.js";
import { getGuestTools } from "./guest";
import { getCommonTools } from "./sjcet";
import type { ChatOptions } from "@/client";
import { getStudentsTools } from "./student";
import { getAllUserTools } from "./user";


export type TOOLS = Record<string, CoreTool>

export type NeccessaryInfo = {
} & Awaited<ReturnType<Message["getContact"]>>

export const generateTools = async (chatOptions: ChatOptions) => {
    const { number, isUser, getChat, getFormattedNumber } = await chatOptions.message.getContact()

    const role = "NA" as AllRoles

    const tools = {
        ...getCommonTools(),
        ...role === "NA" ? getGuestTools() : getAllUserTools(),
        ...role === "student" ? getStudentsTools() : {},
    }

    return async (options: Parameters<typeof generateText>[0]) => await generateText({
        ...options,
        toolChoice: "required",
        tools,
    })

}