import { json2csv, csv2json } from 'json-2-csv';
import { createToken, type TokenData, tokenDataZod } from "@/lib/encryption";
import { z } from 'zod';

type EventData = Pick<TokenData, "event">["event"]

const eventData: EventData = {
    // Event Data

    title: "INSENDIUM 2024",
    activityPoints: 5,
    description: "an ideation workshop for young entrepreneurs & innovators",
    link: "instagram link",
    organisedBy: "IEDC"
}
const eventId = "insendium-24"

const inputCSV = './script/data.csv';


const csv = await Bun.file(inputCSV).text()

const json = csv2json(csv, {
    trimHeaderFields: true,
    trimFieldValues: true,
})

const validatedJson = z.array(
    tokenDataZod.omit({ "event": true, id: true })
        .merge(z.object({ number: z.number().min(999_999_999).transform(e => `${e}`) }))
).parse(json)

const outputJsonData = validatedJson.map(e => ({
    ...e,
    token: createToken(eventId, e.email, eventData),
}))

const outputCsv = './script/out.csv';

const outputData = json2csv(outputJsonData)

await Bun.write(
    outputCsv,
    outputData
)

const outputJson = './script/out.json';
await Bun.write(
    outputJson,
    JSON.stringify(outputJsonData, null, 3)
)