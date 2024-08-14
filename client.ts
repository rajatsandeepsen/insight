import Whatsapp from 'whatsapp-web.js'
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