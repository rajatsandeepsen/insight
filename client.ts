import Whatsapp, { type Chat, type Client as ClientType, type Message } from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal';
const { Client, LocalAuth } = Whatsapp

const client = new Client({
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

client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});

export {
    client
}