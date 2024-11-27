import JsonData from "@/script/events/shortlist.json";
import { csvToJsonZod } from "../validation";

const json = csvToJsonZod.parse(JsonData)
console.log(json)