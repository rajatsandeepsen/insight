import { client } from "@/source/client";
import JsonData from "@/script/certificates/out.json";
import { dataZod, type CertificateZod } from "./validation";
import { MessageMedia } from "whatsapp-web.js";
import { sentMail } from "@/source/mailer";

const json = dataZod.parse(JsonData)
// const id = "top20coders-24-participation"
// const imageFolder = `./script/certificates/${id}`

const getMessages = (data: CertificateZod[0]) => {
    const { name } = data
    return `Hello  ${name}! 
Here's your Top 20 Coders 2024 Certificate of Participation.

On behalf of all the tech communities in SJCET, we express our sincere gratitude and profound appreciation for your participation in our program. 
We are very excited to welcome you to our coding family and grow together. We will be back with more competitions and workshops. 
We look forward to your continued involvement and cooperation in our future ventures. 

Thank you 😊

${getSecondMessage}`
}

const getSecondMessage = `NB: If you have any queries regarding the certificate, please contact us on whatsapp.

Rajat Sandeep
CTO IEDC SJCET
`




// biome-ignore lint/complexity/noForEach: <explanation>
json.forEach(async (data, i) => {
    const { number, email } = data

    sentMail({
        to: email,
        subject: "Your team have been selected to participate in SIH at SJCET Palai",
        text: getMessages(data)
    })
    .then((e) => {
        console.log(`${i}. Sent to ${email} ✅`)
    })
    .catch(e => {
        console.log(`error while ${email}`, e)
    })

    // const imagePath = imageFolder + `/${email}.png`
    // const media = MessageMedia.fromFilePath(imagePath);

    // const first = await client.sendMessage(id, media, { 
    //     caption: getMessages(data), 
    //     sendMediaAsDocument: true,
    // });
    // const done = await first.reply(getSecondMessage)
    
})