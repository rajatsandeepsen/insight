import type { CoreMessage, ToolContent } from "ai";
import { prefixRedis, redisClient } from "./client";
import type WAWebJS from "whatsapp-web.js";
import type { generateTools } from "@/tools";
import type { User } from "./user";
import { extractFromText } from "@/lib/chat";

type Message = WAWebJS.Message
type GetReturn<T extends AsyncAnyFunc> = Awaited<ReturnType<T>>
type Tools = GetReturn<GetReturn<typeof generateTools>>

const getMessageType = (m: Message) => {
    const mm = m.body.trim()
    if (mm.length !== 0) return mm

    if (m.hasMedia) {
        switch (m.type) {
            case "image": return "** user sent a image **"
            case "ptt":
            case "audio": return "** user sent an audio message **"
            // case "document": return "** user sent a document **"
            // case "video": return "** user sent a video **"
        }
    }

    return ""
}


export class MessageQueues {
    private key
    public coreMessages: CoreMessage[]
    public texts: string[] = []

    constructor(private number: string, private messages: Message[] = []) {
        this.number = number;
        this.key = MessageQueues.setKey(number);
        this.coreMessages = MessageQueues.MessageToCore(messages)
    }

    addMessage(messages: Message[]) {
        this.coreMessages = this.coreMessages.concat(MessageQueues.MessageToCore(messages))
    }

    private static setKey(number: string) {
        return `${prefixRedis}status:${number}`;
    }

    static MessageToCore(messages: Message[]): CoreMessage[] {
        return messages.map(m => {

            if (!m.fromMe) {
                const mmm = getMessageType(m)
                return {
                    content: mmm,
                    role: "user"
                } as CoreMessage
            }

            const { role, content } = extractFromText(m.body)

            if (role === "tool")
                return {
                    role,
                    content: [{
                        toolName: content.toolName,
                        result: `invoked tool with args: ${JSON.stringify(content.args)}`,
                    }] as ToolContent
                }

            return {
                role,
                content
            } as CoreMessage
        })
    }

    static CoreToMessage(toolResults: Tools["toolResults"]) {
        const texts: string[] = []
        for (const toolResult of toolResults) {
            console.log("A:", toolResult.toolName)
            console.log("Arg:", toolResult.args)

            texts.push(MessageQueues.getToolText(toolResult.toolName, toolResult.args))

            if (typeof toolResult.result === "string") {
                texts.push(MessageQueues.getSystemText(toolResult.result));
            }
            else {
                texts.push(
                    MessageQueues.getSystemText(
                        JSON.stringify(toolResult.result)
                    )
                );
            }
        }

        return texts
    }

    static getToolText(toolName: string, args: any = {}) {
        return `> \`\`\`${toolName}(${JSON.stringify(args)})\`\`\``
    }

    static getSystemText(str: string) {
        return "`" + str + "`"
    }

    private async get() {
        return await redisClient.get<string>(this.key);
    }
    async clear() {
        await redisClient.del(this.key);
    }

    async addUserMessage(reply: string) {
        const mm = reply.trim()
        if (mm.length) {
            console.log("A:", mm)
            this.coreMessages.push({
                role: "user",
                content: mm
            })
        }
    }

    async sentTools(reply: Tools) {
        if (reply.text) {
            console.log("A:", reply.text)
            this.texts.push(reply.text)
        }

        if (reply.toolResults)
            this.texts = this.texts.concat(MessageQueues.CoreToMessage(reply.toolResults))

        // if (reply.toolCalls)
        //     this.texts = this.texts.concat(MessageQueues.CoreToMessage1(reply.toolCalls))
    }
    async updateStatus(userData?: User["data"]) {
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

const message = [
    {
        fromMe: true,
        body: "`system`"
    },
    {
        fromMe: true,
        body: "llm"
    },
    {
        fromMe: true,
        body: '> tools({"email":"HI"})'
    },
]

// @ts-ignore
// const x = new MessageQueues("1234567890", message)

// console.log(x.coreMessages)
// // @ts-ignore
// await x.reply({
//     toolResults: [{
//         args: {
//             email: "qwertyui",
//         },
//         result: "12345678",
//         toolCallId: "12345678",
//         toolName: "login",
//         type: "tool-result"
//     }]
// })
// // @ts-ignore
// await x.reply({ text: "hi" })
// // @ts-ignore
// await x.reply({})
// console.log(x.texts)