import Whatsapp, { type Chat, type Client as ClientType, type Message } from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal';
const { Client, LocalAuth } = Whatsapp

const client = new Client({
    puppeteer: {
        headless: true,
        args: ["--no-sandbox"],
      },
    authStrategy: new LocalAuth({
        dataPath: 'authContainer'
        // dataPath: 'localAuth'
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

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
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