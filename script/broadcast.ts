import { client } from "@/client";
import { z } from "zod";
import JsonData from "@/script/out.json";

const dataZod = z.array(z.object({
    email: z.string().email(),
    number: z.string().length(10),
    token: z.string()
}))

const json = dataZod.parse(JsonData)


client.on('ready', () => {
    console.log('Client is ready! Preparing data from JSON');

    json.forEach(data => {
        const { number, email, token } = data

        client.isRegisteredUser(`91${number}@c.us`)
            .then((isRegistered) => {
                if (isRegistered) {
                    client.sendMessage(`91${number}@c.us`, `hello ${email}\n\n${token}`);
                }
            })
            .catch(e => console.log(`User "${number}" is not valid number`))
    })

});

client.initialize();