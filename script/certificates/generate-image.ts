import Jimp from "jimp";
import QRCode from 'qrcode'
import JsonData from "@/script/certificates/out.json";
import { dataZod } from "@/script/validation";

const parentFolder = "./script/certificates"

const template1 = (templateImage: Jimp) => ({
    image: {
        x: 0, y: 1024 + 36, // position
        maxX: templateImage.getWidth(),
        maxY: 0 // size
    },
    qr: {
        getX: (qrImage: Jimp) => templateImage.getWidth() - qrImage.getWidth() - 75,
        getY: (qrImage: Jimp) => templateImage.getHeight() - qrImage.getHeight() - 68 // position
    }
})
const template2 = (templateImage: Jimp) => ({
    image: {
        x: templateImage.getWidth() / 2, y: 30, // position
        maxY: templateImage.getHeight(),
        maxX: templateImage.getWidth() / 2// size
    },
    qr: {
        getX: (qrImage: Jimp) => 30, // position
        getY: (qrImage: Jimp) => templateImage.getHeight() - qrImage.getHeight() - 30
    }
})


const data = dataZod.parse(JsonData) //.slice(4, 5)
const eventId = "insendium-24"

const fileName = `${eventId}.png` // 'template1.png'
const templateImage = await Jimp.read(`${parentFolder}/resources/${fileName}`)
const template = template1(templateImage) // template1(templateImage)

// const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK)
const font = await Jimp.loadFont(`${parentFolder}/resources/font/spacemono-bold.fnt`)


// biome-ignore lint/complexity/noForEach: <explanation>
data.forEach(async d => {
    const copyTemplateImage = templateImage.clone()
    const qrBuffer = await QRCode.toBuffer(d.token)
    
    copyTemplateImage.print(font, template.image.x, template.image.y,
        {
            text: d.name,
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
        },
        template.image.maxX, template.image.maxY
    );

    const qrImage = await Jimp.read(qrBuffer);
    copyTemplateImage.blit(qrImage, template.qr.getX(qrImage), template.qr.getY(qrImage));

    const certificate = `${parentFolder}/${eventId}/${d.email}.${copyTemplateImage.getExtension()}`;
    const done = await copyTemplateImage.writeAsync(certificate);
})

console.log(`Certificates generated for ${data.length} participants`)