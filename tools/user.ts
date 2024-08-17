import { tool } from "ai"
import type { NeccessaryInfo } from "./index"
import { z } from "zod";

export const getAllUserTools = (neccessaryInfo?: NeccessaryInfo) => {
    return {
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

        getCommunityInvitation: tool({
			description: 'Get the invitation to join a specific community whatsapp group',
			parameters: z.object({
				communityName: z.enum(["IEDC", "IEEE", "GDSC", "TinkerHub", "Nexus", "SAE", "NSS"]).describe("Name of the community")
			}),
			execute: async () => {

				return "Enna link.. click cheyy"
			},
		}),

        logout: tool({
            description: 'Logout or remove account',
            parameters: z.object({}),
            execute: async () => {
                return `Signed out from this Whatapp Number`
            },
        }),
    }
}