import { z } from "zod";
import { generateText, tool } from "ai";
import { llama } from "./model";
import type { Client, Chat, Message } from "whatsapp-web.js";
import { WA } from "./client";
import { getDataFromMail } from "./lib/email";
import { questionTemaplate, system } from "@/tools/sjcet";

export const getResponseTool = async (
	prompt: string,
	{ quote, message, chat, client }: Partial<{ quote: Message, message: Message, chat: Chat, client: Client }>
) => await generateText({
	prompt,
	model: llama,
	system,
	toolChoice: "required",
	tools: {
		getInformation: tool({
			description: 'Get answers for any questions/information about SJCET college',
			parameters: z.object({
				question: z.string().describe("The question or the information looking for")
			}),
			execute: async ({ question }) => {
				console.log("Searching for:", question)

				const prompt = questionTemaplate(question)

				const res = await getResponse(prompt)

				console.log(res)

				return res
			},
		}),
		getEvents: tool({
			description: 'Get events details happening/upcoming in SJCET college',
			parameters: z.object({
				eventName: z.string().optional().describe("About a specific event")
			}),
			execute: async ({ eventName }) => {
				if (!eventName) {
					return new WA.List('Insendium', 'WedCafe', [
						{
							title: 'sectionTitle',
							rows: [
								{ id: 'customId', title: 'ListItem2', description: 'desc' },
								{ title: 'ListItem2' }
							]
						}], 'Top20Designers');
				}
				return `${eventName}... ath kazhinj poyi.. hahaha`
			},
		}),
		login: tool({
			description: 'Login to the INSIGHT system',
			parameters: z.object({
				collegeEmail: z.string().describe("College email address"),
				fullName: z.string().describe("Full name of the user")
			}),
			execute: async ({ collegeEmail }) => {
				if (!collegeEmail) return "Please provide your college email address to login"

				const { isSJCET, data } = getDataFromMail(collegeEmail)


				if (!isSJCET || !data) return "You are not autherized to login. Need SJCET college Email ID"

				return `Hello ${data.college} 👋\n\nWelcome to INSIGHT SJCET\n\nLogined as ${data?.year !== "NA" ? "Student" : "Faculty\nContact Admin for Extra Insights"}\n\nOTP has been sent, paste it here to verify.`
			},
		}),
		OTP: tool({
			description: 'If prompt contains 6 digit OTP',
			parameters: z.object({
				number: z.number().min(99999).max(999999).describe("The 6 digit OTP")
			}),
			execute: async ({ number }) => {
				// if (number)

				return "OTP verified"

				// return `Hello ${data.name} 👋\n\nWelcome to INSIGHT SJCET\n\nLogined as ${data?.year !== "NA" ? "Student" : "Faculty\nContact Admin for Extra Insights"}`
			},
		}),
		register: tool({
			description: 'Register to a Event',
			parameters: z.object({
				eventName: z.string().optional().describe("Name of the event")
			}),
			execute: async ({ eventName }) => {
				if (!eventName) return "Please provide the event name to register"

				const res = "Register cheyth sett akki"

				return res
			},
		}),
		subscribe: tool({
			description: 'Subscribe to INSIGHT notification systems for events and updates inside college',
			parameters: z.object({
				clubs: z.array(
					z.enum(["IEDC", "IEEE", "GDSC", "TinkerHub", "Nexus", "SAE", "NSS"])
				).describe("Clubs to subscribe")
			}),
			execute: async ({ clubs }) => {
				if (!clubs.length) return "Please provide the name of clubs to subscribe"

				const res = "Ellem subscribe cheyth sett akki"

				return res
			},
		}),
		getActions: tool({
			description: 'Get the list of actions you can perform with INSIGHT',
			parameters: z.object({}),
			execute: async () => {
				const button =
					new WA.Buttons('Button body', [{ body: 'bt1' }, { body: 'bt2' }, { body: 'bt3' }], 'title', 'footer');
				return button
			},
		}),
		getCommunityInvitation: tool({
			description: 'Get the invitation to join a specific community whatsapp group',
			parameters: z.object({
				communityName: z.enum(["IEDC", "IEEE", "GDSC", "TinkerHub", "Nexus", "SAE", "NSS"]).describe("Name of the community")
			}),
			execute: async () => {

				return "Enna link.. click cheyy"
			},
		}),
	},
});

export const getResponse = async (prompt: string, systemText = system) => (await generateText({
	prompt,
	model: llama,
	system: systemText,
})).text