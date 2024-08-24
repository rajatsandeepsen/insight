import { client } from "@/source/client";
import JsonData from "@/script/certificates/out.json";
import { dataZod } from "./validation";

const json = dataZod.parse(JsonData)


client.on('ready', () => {
    console.log('Client is ready! Preparing data from JSON');

    // biome-ignore lint/complexity/noForEach: <explanation>
    json.forEach(data => {
        const { number, email, token } = data

        client.isRegisteredUser(`91${number}@c.us`)
            .then((isRegistered) => {
                if (isRegistered) {
                    client.sendMessage(`91${number}@c.us`, `hello ${email}\n\n${token}`);
                }
            })
            .catch(e => console.log(`User "${number}" is not valid whatsapp number`))
    })

});

client.initialize();