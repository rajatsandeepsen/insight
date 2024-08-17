import { createOpenAI, type openai } from "@ai-sdk/openai";
import { system } from "./tools/sjcet";
import { generateText } from "ai";

const groq = createOpenAI({
	baseURL: "https://api.groq.com/openai/v1",
	apiKey: process.env.GROQ_API_KEY,
});

export const model = groq("llama3-8b-8192");

export const getResponse = async (prompt: string, systemText = system) => (await generateText({
	prompt,
	model,
	system: systemText,
})).text