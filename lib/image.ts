import jsQR from "jsqr";
import Jimp from "jimp";
import type { ReturnGetDataFromMail } from "./email";
import type { TokenData, verifyToken } from "./encryption";

export async function readQRCode(image: string) {
    const rawData = Buffer.from(image, 'base64');
    const imageData = await Jimp.read(rawData);

    const resultString = (jsQR(new Uint8ClampedArray(imageData.bitmap.data), imageData.bitmap.width, imageData.bitmap.height))?.data;

    if (!resultString) {
        return {
            error: new Error("Data could not be interpreted"),
            data: null
        }
    }
    return {
        data: resultString,
        error: null
    }
}

const QRsystem = `Prompt includes data about an event and user who participated it. Write a small summary in markdown. Mension all key values in sentence.  Respond in third person, eg: "User has successfully participated at this event"`

export const getPromptForQRImages = (user: ReturnGetDataFromMail, data: ReturnType<typeof verifyToken<TokenData>>["data"]) => {
    const prompt = JSON.stringify({
        user, event: data.event
    })
    const system = QRsystem
    return { prompt, system }
}