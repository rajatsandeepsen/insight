import { client } from "@/source/client";
import JsonData from "@/script/certificates/fossday-24/reset.json";
import { dataZod, type CertificateZod } from "./validation";
import { sentMail, simpleHTMLMail } from "@/source/mailer";
import { getMessages } from "./message";
import fs from "fs";
import { promisify } from "util";

const readFileAsync = promisify(fs.readFile);

const json = dataZod.parse(JsonData)
const id = "fossday-24"
const imageFolder = `./script/certificates/${id}`



// biome-ignore lint/complexity/noForEach: <explanation>
json.forEach(async (data, i) => {
    const { number, email } = data

    const imageAttachment = await readFileAsync(imageFolder + `/${email}.png`, { encoding: 'base64' });
    const text = getMessages(data)
    const subject = "FOSSDAY'24 - Certification"

    sentMail({
        to: email,
        text,
        subject,
        html: simpleHTMLMail({
            title: subject,
            body: `<p>${text}</p><img src="cid:uniqueImageCID" alt="${subject}">`,
        }),
        attachments: [{
            filename: `${email}.png`,
            content: imageAttachment,
            encoding: 'base64',
            cid: 'uniqueImageCID', // Referenced in the HTML template
        }],
    })
        .then((e) => {
            console.log(`${i}. Sent to ${email}, ${number} ✅`)
        })
        .catch(e => {
            console.log(`error while ${email}, ${number}`, e)
        })
})