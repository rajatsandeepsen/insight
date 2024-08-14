import { createOpenAI, type openai } from "@ai-sdk/openai";

const groq = createOpenAI({
	baseURL: "https://api.groq.com/openai/v1",
	apiKey: process.env.GROQ_API_KEY,
});

export const llama = groq("llama3-8b-8192");