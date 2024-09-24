import { client } from "@/source/client";
import JsonData from "@/script/certificates/out.json";
import { dataZod, type CertificateZod } from "./validation";
import { MessageMedia } from "whatsapp-web.js";

const json = dataZod.parse(JsonData)
const id = "hackathon-qr"
const imageFolder = `./script/certificates/${id}`

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const getMessages = (data: CertificateZod[0]) => {
    const { team, name, token} = data
    return `Hey ${team ?? name} 👋,

Congratulations on completing the Hackathon ideation stage! 🎉

Here is your form to submit the problem statement
${token}

*If there is any missing data, please fill that one too.*
If you have any queries regarding the idea submission, please call any mentors.


Rajat Sandeep
CTO IEDC SJCET

*NB: always use sjcet college email of each members to fill the form.*`
}

const getSecondMessage = `NB: If you have any queries regarding the certificate, please contact us on whatsapp.

Rajat Sandeep
CTO IEDC SJCET
`


client.on('ready', () => {
    console.log('Client is ready! Preparing data from JSON');
    console.log(`Total ${json.length} certificates to send`);


    // biome-ignore lint/complexity/noForEach: <explanation>
    json.forEach((data, i) => {
        const { number, email } = data

        client.isRegisteredUser(`91${number}@c.us`)
            .then(async (isRegistered) => {
                await sleep(1000)
                if (isRegistered) {
                    const id = `91${number}@c.us`

                    // const imagePath = imageFolder + `/${email}.png`
                    // const media = MessageMedia.fromFilePath(imagePath);

                    // const first = await client.sendMessage(id, media, { 
                    //     caption: getMessages(data), 
                    //     // sendMediaAsDocument: true,
                    // });
                    // const done = await first.reply(getSecondMessage)
                    const done = await client.sendMessage(id, getMessages(data))
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