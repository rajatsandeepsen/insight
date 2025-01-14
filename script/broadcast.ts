import { client } from "@/source/client";
import JsonData from "@/script/certificates/fossday-24/reset.json";
import { dataZod, csvToJsonZod, type CertificateZod } from "./validation";
import { MessageMedia } from "whatsapp-web.js";
import { getMessages } from "./message";

const json = dataZod.parse(JsonData)
// console.log(json)

const id = "fossday-24"
const imageFolder = `./script/certificates/${id}`

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))


client.on('ready', () => {
    console.log('Client is ready! Preparing data from JSON');
    console.log(`Total ${json.length} messages to send`);

    
    json.forEach((data, i) => {
        const { number, email } = data

        client.isRegisteredUser(`91${number}@c.us`)
            .then(async (isRegistered) => {

                if (isRegistered) {
                    const id = `91${number}@c.us`

                    const imagePath = imageFolder + `/${email}.png`
                    const media = MessageMedia.fromFilePath(imagePath);

                    const first = await client.sendMessage(id, media, {
                        caption: getMessages(data),
                        sendMediaAsDocument: true,
                    });
                    // const done = await client.sendMessage(id, getMessages(data))
                    // const done2 = await client.sendMessage(id, getMessages2(data))
                    console.log(`${i}. Sent to ${number} ✅`)
                }
                else {
                    console.log(`${i}. User "${email}" not registered: ${number} ❌`)
                }
            })
            .catch(e => console.error(`Error to ${number}`, e))
            .catch(e => console.error(`Error to ${number}`, e))
    })
});

client.initialize();