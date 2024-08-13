import { client } from "./client";
import qrcode from 'qrcode-terminal';

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on('message_create', message => {
	console.log(message.body);
});

client.initialize();