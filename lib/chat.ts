import type { CoreMessage } from "ai";
import type { Label, Message } from "whatsapp-web.js";
import type { SJCET } from "./type";

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

