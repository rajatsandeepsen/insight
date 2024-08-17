import { generateText, tool, type CoreTool } from "ai";
import type { Chat, Client, Message } from "whatsapp-web.js";


type TOOLS = Record<string, CoreTool>

type ChatOptions = {
    quote: Message, 
    message: Message, 
    chat: Chat, 
    client: Client
}

export const generateTools = (chatOptions:ChatOptions) => {
    const tools:TOOLS = {}
    return async (options:Parameters<typeof generateText>[0]) => await generateText({
        ...options, 
        toolChoice: "required",
        tools,
    })

}