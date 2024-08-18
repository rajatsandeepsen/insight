import { client, WA } from "./client";
import qrcode from 'qrcode-terminal';
import { generateTools } from "@/tools/index";
import { model } from "./model";
import { system } from "@/tools/sjcet";

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('message_create', async (message) => {

    if (message.fromMe) return;
    if (message.isStatus) return;
    if (message.hasMedia) {

        // login for QR image validation

        return
    }
    // if (message.) return;

    const chat = await message.getChat();
    chat.sendSeen();
    chat.sendStateTyping();

    console.log("Q:", message.body);

    const AITools = await generateTools({
        chat, client, message,
        quote: message.hasQuotedMsg ? await message.getQuotedMessage() : undefined
    })

    AITools({
        model, 
        prompt: message.body,
        system,
    }).then(reply => {

        for (const toolResult of reply.toolResults) {
            console.log("A:", toolResult.toolName)
            console.log("Arg:", toolResult.args)

            if (typeof toolResult.result === "string") {

                message.reply(toolResult.result);
                return;
            }

            if (toolResult.result instanceof WA.Buttons) {
                const buttons = toolResult.result;
                client.sendMessage(message.from, buttons);
                return;
            }
            if (toolResult.result instanceof WA.List) {
                const list = toolResult.result;
                client.sendMessage(message.from, list);
                return;
            }
        }
    })
        .catch(err => {
            console.error(err);
            message.reply("An error occurred while processing your request. Please try again later.");
        })
        .finally(() => {
            chat.clearState();
        })
});

client.initialize();