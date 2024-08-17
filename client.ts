import Whatsapp, { type Chat, type Client as ClientType, type Message } from 'whatsapp-web.js'
const { Client, LocalAuth } = Whatsapp

export const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: 'authContainer'
    })
});

export const WA = {
    Buttons: Whatsapp.Buttons,
    List: Whatsapp.List
}

export type ChatOptions = {
    quote?: Message,
    message: Message,
    chat: Chat,
    client: ClientType
}