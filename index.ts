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
import { getTranscript } from "./source/voice";
import { MessageQueues } from "./cache/queue";

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
    const chat = await message.getChat();
    const MSQ = new MessageQueues(validatedNumber)


    if (message.hasMedia && message.type === "image") {
        const media = await message.downloadMedia();
        switch (media.mimetype) {
            case "image/jpeg":
            case "image/png": {

                await message.reply(
                    MessageQueues.getToolText("getQRfromImage")
                );
                const { error, data } = await readQRCode(media.data)

                if (error) {
                    await message.reply(
                        MessageQueues.getSystemText("Unable to identify any QR patterns from the image")
                    )
                    return
                }

                const { data: info, error: infoE } = verifyToken<TokenData>(data)
                if (infoE) {
                    await message.reply(
                        MessageQueues.getSystemText("Invalid QR code image (unabled to verify token)")
                    );
                    return
                }

                const user = getDataFromMail(info.email)
                if (!user.data) {
                    await message.reply(
                        MessageQueues.getSystemText("User data from QR code image is not valid")
                    );
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

    await MSQ.updateStatus(user?.data)
    chat.sendSeen();
    chat.sendStateTyping();
    console.log("L:", await chat.getLabels())

    if (message.hasMedia && (message.type === "audio" || message.type === "ptt")) {
        const audio = await message.downloadMedia();
        await message.reply(MessageQueues.getToolText("getTranscript"))
        const text = await getTranscript(audio.data)
        if (text) {
            await message.reply(MessageQueues.getSystemText(`Transcription: ${text}`))
        }
    }

    MSQ.addMessage(await chat.fetchMessages({ limit:10 }))


    const AITools = await generateTools({ chat, role, number: validatedNumber }, user ?? undefined)

    const messages = MSQ.coreMessages

    console.log("M:", messages)

    AITools({ messages })
        .then(async reply => {
            await MSQ.sentTools(reply)
            await Promise.all(MSQ.texts.map((m, i) => message.reply(m)))
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