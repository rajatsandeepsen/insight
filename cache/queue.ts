import type { CoreMessage, ToolContent } from "ai";
import { prefixRedis, redisClient } from "./client";
import type WAWebJS from "whatsapp-web.js";
import type { generateTools } from "@/tools";
import type { User } from "./user";
import { GetEmojiAndText } from "@/lib/chat";

type Message = WAWebJS.Message
type GetReturn<T extends AsyncAnyFunc> = Awaited<ReturnType<T>>

const emoji: Record<string, CoreMessage["role"]> = {
    "🤖": "assistant",
    "⚙": "tool",
    "🖥": "system"
}

export class MessageQueues {
    private key
    public coreMessages: CoreMessage[]

    constructor(private number: string, private messages: Message[]) {
        this.number = number;
        this.key = MessageQueues.setKey(number);

        this.coreMessages = MessageQueues.MessageToCore(messages)
    }

    private static setKey(number: string) {
        return `${prefixRedis}status:${number}`;
    }

    static MessageToCore(messages: Message[]): CoreMessage[] {
        return messages.map(m => {
            const mm = m.body.trim()

            if (!m.fromMe) return {
                content: m.body,
                role: "user"
            }

            const res = GetEmojiAndText(mm)
            if (!res) return {
                role: "assistant",
                content: mm
            }

            const role = emoji[res.emoji] ?? "assistant"

            if (role === "tool") return {
                role,
                content: [{
                    // todo
                }] as ToolContent
            }

            return {
                role,
                content: res.text
            }
        })
    }

    static CoreToMessage(toolResults: GetReturn<GetReturn<typeof generateTools>>["toolResults"]) {
        const texts: string[] = []
        for (const toolResult of toolResults) {
            console.log("A:", toolResult.toolName)
            console.log("Arg:", toolResult.args)

            if (typeof toolResult.result === "string") {
                texts.push(toolResult.result);
            }

            // 
        }

        return texts
    }

    private async get() {
        return await redisClient.get<string>(this.key);
    }
    async clear() {
        await redisClient.del(this.key);
    }

    async reply(reply: GetReturn<GetReturn<typeof generateTools>>) {
        const texts: string[] = []
        if (reply.text) {
            console.log("A:", reply.text)
            texts.push(reply.text)
        }

        return texts.concat(MessageQueues.CoreToMessage(reply.toolResults))
    }
    async update(userData?: User["data"]) {
        const status = await this.get()

        if (userData) this.coreMessages.concat([
            {
                content: JSON.stringify(userData),
                role: "system"
            }
        ])

        if (status) this.coreMessages.concat([
            {
                content: status,
                role: "system"
            }
        ])
    }
}