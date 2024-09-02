import type { CoreAssistantMessage, CoreMessage, CoreSystemMessage, ProviderMetadata } from "ai";
import type { Label, Message } from "whatsapp-web.js";
import type { SJCET } from "./type";
import { trys } from "./utils";

export const getEmoji = (str: string) => {
    const emojiRegex = /^(?<emoji>\p{Emoji}+)(?<text>.*)$/u;
    const match = str.match(emojiRegex);

    if (match && match.groups) {
        const { emoji, text } = match.groups
        return {
            emoji, text: text.trim()
        }
    }

    return null
}

type CoreToolMess = {
    role: "tool"
    content: {
        toolName: string,
        args: object,
    }
    experimental_providerMetadata?: ProviderMetadata
}

export const extractFromText = (str: string): CoreSystemMessage | CoreAssistantMessage | CoreToolMess => {
    const functionRegex = />\s*(?<toolName>\w+)\(\s*(?<json>\{.*?\})\s*\)/;
    const match = str.match(functionRegex);

    if (match) {
        const { toolName, json } = match.groups as any
        const { data: args, error } = trys(() => JSON.parse((json ?? "")) as object)
        if (!error)
            return {
                role: "tool",
                content: {
                    toolName,
                    args,
                }
            }
    }

    const textRegex = /`(?<text>[^`]+)`/;
    const textMatch = str.match(textRegex);

    if (textMatch) {
        const { text } = textMatch.groups as any
        if (text && text.trim().length > 0)
            return { role: "system", content: text.trim() }
    }

    return {
        content: str.trim(),
        role: "assistant"
    }
}

export const convertChat = (messages: Message[], lastMessage: string, secondLastSystem: string): CoreMessage[] => {
    const chat: CoreMessage[] = messages.map(message => {
        return {
            content: message.body,
            role: message.fromMe ? "assistant" : "user",
        }
    })

    return chat.concat([{
        content: secondLastSystem,
        role: "system"
    },
    {
        content: lastMessage,
        role: "user"
    }])
}

export const convertLabels = (labels: Label[], data?: SJCET, extra?: string[]): string[] => {
    const names: string[] = extra ? extra : []
    if (data) {
        if (data.year !== "NA") names.push(data.year)
        if (data.department !== "NA") names.push(data.department)
        if (data.role !== "NA") names.push(data.role)
    }
    else {
        names.push("NA")
    }
    console.log("L:", names)

    return checkLabel(labels, names)
}

export const checkLabel = (labels: Label[], names: string[]): string[] => {
    return labels.filter(label => names.includes(label.name)).map(e => e.id)
}

