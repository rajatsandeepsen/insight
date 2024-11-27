import { base64ToFile } from "@/lib/audio";
import Groq from "groq-sdk";

export const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export async function getTranscript(input: string) {
    const audioFile = base64ToFile(input, 'audio.ogg');
	try {
		const { text } = await groq.audio.transcriptions.create({
			file: audioFile,
			model: "whisper-large-v3",
		});

		return text.trim() || null;
	} catch {
		return null; // Empty audio file
	}
}