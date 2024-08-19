import jsQR from "jsqr";
import Jimp from "jimp";

export async function readQRCode(image: string): Promise<string> {
    const rawData = Buffer.from(image, 'base64');
    const imageData = await Jimp.read(rawData);

    const resultString = (jsQR(new Uint8ClampedArray(imageData.bitmap.data), imageData.bitmap.width, imageData.bitmap.height))?.data;

    if (!resultString) {
        throw new Error("Data could not be interpreted")
    }

    return resultString;
}