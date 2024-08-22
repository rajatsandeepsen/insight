import { generateTools } from "@/tools/index";
import qrcode from 'qrcode-terminal';
import { User } from "@/cache/user";
import { client } from "@/client";
import { extractNumber, getDataFromMail } from "@/lib/email";
import { tryAsync, trys } from "@/lib/utils";
import { getUserPrompt, system } from "@/tools/sjcet";
import { getPromptForQRImages, readQRCode } from "@/lib/image";
import { verifyToken, type TokenData } from "@/lib/encryption";
import { getResponse } from "@/model";

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message_create', async (message) => {

    if (message.fromMe) return;
    if (message.isStatus) return;

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
                    message.reply("Unable to identify QR inside the image");
                    return
                }

                const { data: info, error: infoE } = verifyToken<TokenData>(data)
                if (infoE) {
                    message.reply("Unable to token inside QR image");
                    return
                }

                const user = getDataFromMail(info.email)
                if (!user.data) {
                    message.reply("User data is not validated");
                    return
                }

                const { prompt, system } = getPromptForQRImages(user, info)
                const res = await getResponse(prompt, system)
                message.reply(res);
            }
        }
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