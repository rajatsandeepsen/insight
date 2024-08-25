import { client } from "@/source/client";
import JsonData from "@/script/certificates/out.json";
import { dataZod, type CertificateZod } from "./validation";
import { MessageMedia } from "whatsapp-web.js";

const json = dataZod.parse(JsonData)
const id = "insendium-24"
const imageFolder = `./script/certificates/${id}`

const getMessages = (data: CertificateZod[0]) => {
    const { name } = data
    return `Hello  ${name}! 
Here's your INSENDIUM'24 certificate.

On behalf of SJCET-BOOTCAMP-IEDC, we express our sincere gratitude and profound appreciation for your participation in our program. 
We are very excited to welcome you to our bootcamp family and grow together. We will be back with more competitions and workshops. 
We look forward to your continued involvement and cooperation in our future ventures. 

Thank you 😊

${getSecondMessage}`
}

const getSecondMessage = `NB: If you have any queries regarding the certificate, please contact us on whatsapp.

Rajat Sandeep
CTO  SJCET-BOOTCAMP-IEDC
`


client.on('ready', () => {
    console.log('Client is ready! Preparing data from JSON');
    console.log(`Total ${json.length} certificates to send`);


    // biome-ignore lint/complexity/noForEach: <explanation>
    json.forEach((data, i) => {
        const { number, email } = data

        client.isRegisteredUser(`91${number}@c.us`)
            .then(async (isRegistered) => {
                if (isRegistered) {
                    const imagePath = imageFolder + `/${email}.png`
                    const media = MessageMedia.fromFilePath(imagePath);

                    const first = await client.sendMessage(`91${number}@c.us`, media, { 
                        caption: getMessages(data), 
                        sendMediaAsDocument: true,
                    });
                    // const done = await first.reply(getSecondMessage)
                    console.log(`${i}. Sent to ${number} ✅`)
                }
                else {
                    console.log(`User not registered: ${number} ❌`)
                }
            })
            .catch(e => console.error(`Error to ${number}`, e))
        .catch(e => console.error(`Error to ${number}`, e))
    })
});

client.initialize();