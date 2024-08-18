import { generateTools } from "@/tools/index";
import qrcode from 'qrcode-terminal';
import { User } from "./cache/user";
import { client, WA } from "./client";
import { extractNumber } from "./lib/email";
import { tryAsync, trys } from "./lib/utils";
import { getUserPrompt, system } from "./tools/sjcet";

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

    const { number, isUser } = await message.getContact()

    if (!isUser) return

    const { data: validatedNumber, error: numberError } = trys(() => extractNumber(number))
    if (numberError) return

    const { data: user, error: userError } = await tryAsync(async () => await User.get(validatedNumber))
    if (userError) return

    const role = user?.data.role ?? "NA"

    if (message.hasMedia) {

        // login for QR image validation

        return
    }


    console.log("Q:", message.body);

    const AITools = await generateTools({ role, number: validatedNumber })

    const chat = await message.getChat();
    chat.sendSeen();
    chat.sendStateTyping();

    AITools({
        system,
        prompt: getUserPrompt(message.body, user?.data)
    }).then(reply => {

        if (reply.text && reply.toolResults.length === 0) {
            console.log("A:", reply.text)
            message.reply(reply.text)
        }

        for (const toolResult of reply.toolResults) {
            console.log("A:", toolResult.toolName)
            console.log("Arg:", toolResult.args)

            if (typeof toolResult.result === "string") {

                message.reply(toolResult.result);
                return;
            }

            // if (toolResult.result instanceof WA.Buttons) {
            //     const buttons = toolResult.result;
            //     client.sendMessage(message.from, buttons);
            //     return;
            // }
            // if (toolResult.result instanceof WA.List) {
            //     const list = toolResult.result;
            //     client.sendMessage(message.from, list);
            //     return;
            // }
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