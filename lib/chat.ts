import type { CoreMessage } from "ai";
import type { Message } from "whatsapp-web.js";

export const convertChat = (messages: Message[], lastMessage: string, secondLastSystem: string): CoreMessage[] => {
    const chat: CoreMessage[] = messages.map(message => {
        return {
            content: message.body,
            role: message.fromMe ? "assistant" : "user",
        }
    })

    chat.concat([{
        content: secondLastSystem,
        role: "system"
    },
    {
        content: lastMessage,
        role: "user"
    }])

    return chat
}