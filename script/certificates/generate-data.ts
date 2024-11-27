import { json2csv, csv2json } from 'json-2-csv';
// import { createToken } from "@/lib/encryption";
import { csvToJsonZod, dataZod } from '@/script/validation';
// import Certificates from "@/data/certificate.json";

// const id = "insendium-24"
// const certificate = Certificates[id]
const parentFolder = "./script/events"

const inputCSV = `${parentFolder}/shortlist.csv`;


const csv = await Bun.file(inputCSV).text()

const json = csv2json(csv, {
    trimHeaderFields: true,
    trimFieldValues: true,
})

console.log(json)

const validatedJson = csvToJsonZod.parse(json)

const outputJsonData = validatedJson.map(e => ({
    ...e,
    // token: createToken({ 
    //     // id, 
    //     email: e.email, type: "certificate" }),
}))

const outputCsv = `${parentFolder}/out.csv`;

const outputData = json2csv(validatedJson)

await Bun.write(
    outputCsv,
    outputData
)

const outputJson = `${parentFolder}/out.json`;
await Bun.write(
    outputJson,
    JSON.stringify(outputJsonData, null, 3)
)

console.log(`Data generated:\n ${outputCsv}\n ${outputJson}`)