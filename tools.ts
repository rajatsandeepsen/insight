import { z } from "zod";
import { generateText, tool } from "ai";
import { llama } from "./model";
import type { Client, Chat, Message } from "whatsapp-web.js";
import { WA } from "./client";

const system = "You are a helpful whatsapp bot named INSIGHT that build for students at SJCET Palai college."

const newestDataAboutSJCET = [
	"SJCET Palai has received accreditation from the National Board of Accreditation (NBA) for several of its undergraduate engineering programs",
	`The college has been awarded NAAC 'A' grade and obtained autonomous status by July 2024`,
	"It is certified under ISO 9001:2008 and holds ISO 9001:2015 and ISO 14001:2015 certifications"
]

const aboutSJCET = `St. Joseph's College of Engineering and Technology (SJCET), Palai is a private engineering college located in Pala, Kerala, India. 
It was established in 2002 by the Diocesan Technical Education Trust of the Catholic Diocese of Palai and is affiliated with Mahatma Gandhi University, Kottayam and APJ Abdul Kalam Technological University. 
SJCET Palai is approved by the All India Council for Technical Education (AICTE) and offers professional degree programs in engineering and management.

website: https://www.sjcetpalai.ac.in/
Address: Choondacherry, Palai, Kerala 686579
Principal: Dr. V. P. Devassia
`

const questionTemaplate = (q: string) => `Data: ${aboutSJCET} 

Newest Information: ${newestDataAboutSJCET.join("\n")}

Instruction: Answer the following questions from above data. If question is not about SJCET, just say "Im not created for these questions"

Question: ${q}
Anwser: `

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
						{title:'sectionTitle',
							rows:[
								{id:'customId', title:'ListItem2', description: 'desc'},
								{title:'ListItem2'}
							]
						}], 'Top20Designers');
				}
				return `${eventName}... ath kazhinj poyi.. hahaha`
			},
		}),
		login: tool({
			description: 'Login to the INSIGHT system',
			parameters: z.object({
				collegeEmail: z.string().optional().describe("College email address")
			}),
			execute: async ({ collegeEmail }) => {
				if (!collegeEmail) return "Please provide your college email address to login"


				const res = "Login cheyth sett aayi"

				return res
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