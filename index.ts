import { User } from "@/cache/user";
import { client } from "@/source/client";
import { extractNumber, getDataFromMail } from "@/lib/email";
import { verifyToken, type TokenData } from "@/lib/encryption";
import { getPromptForQRImages, readQRCode } from "@/lib/image";
import { tryAsync, trys } from "@/lib/utils";
import { getResponse } from "@/source/model";
import { generateTools } from "@/tools/index";
import { getUserInfo, system } from "@/tools/sjcet";
import Events from "@/data/event.json";
import { convertChat } from "./lib/chat";

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message_create', async (message) => {

    if (message.fromMe) return;
    if (message.isStatus) return;

    const oneHourInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (currentTimestamp - message.timestamp > oneHourInSeconds) return

    const { number, isUser } = await message.getContact()

    if (!isUser) return

    const { data: validatedNumber, error: numberError } = trys(() => extractNumber(number))
    if (numberError) return

    const { data: user, error: userError } = await tryAsync(async () => await User.get(validatedNumber))
    // if (userError) return

    const role = user?.data.role ?? "NA"

    if (message.hasMedia) {
        const media = await message.downloadMedia();
        switch (media.mimetype) {
            case "image/jpeg":
            case "image/png": {

                const { error, data } = await readQRCode(media.data)

                if (error) {
                    await message.reply("Unable to identify any QR patterns from the image");
                    return
                }

                const { data: info, error: infoE } = verifyToken<TokenData>(data)
                if (infoE) {
                    await message.reply("Invalid QR code (unabled to verify token)");
                    return
                }

                const user = getDataFromMail(info.email)
                if (!user.data) {
                    await message.reply("User data from QR is not valid");
                    await message.reply(`\`\`\`\n${JSON.stringify(info, null, 2)}\n\`\`\``);
                    return
                }

                const { prompt, system } = getPromptForQRImages(user, info)
                const res = await getResponse(prompt, system)
                await message.reply(res);
            }
        }
        return
    }

    console.log("Q:", message.body);

    const chat = await message.getChat();
    const AITools = await generateTools({ chat, role, number: validatedNumber }, user ?? undefined)

    chat.sendSeen();
    chat.sendStateTyping();
    console.log("L:", await chat.getLabels())

    const messages = convertChat(
        await chat.fetchMessages({ limit: 10 }),
        message.body,
        getUserInfo(user?.data)
    )

    AITools({ messages }).then(reply => {

        if (reply.text) {
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
            // else {
            //     for (const small of toolResult.result.toolResults) {
            //         console.log("S_A:", small.toolName)
            //         console.log("S_Arg:", small.args)

            //         if (typeof small.result === "string") {

            //             message.reply(small.result);
            //             return;
            //         }
            //     }
            // }

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