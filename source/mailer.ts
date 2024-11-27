import nodemailer from "nodemailer";
import { tryAsync } from "@/lib/utils";
import { OtpMailTemplate } from "@/data/otp-mail";

const transporter = nodemailer.createTransport({
    pool: true,
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.NM_EMAIL,
        pass: process.env.NM_PASS,
    },
});

type MailOptions = {
    to: string
    subject: string
    text: string
    html?: string  
}

export const sentMail = async (props:MailOptions) => {
    return await tryAsync(async () => await transporter.sendMail(props))
}

export const sentOTP = async (to:string, otp:number, phone:string) => await sentMail({
    to, 
    subject: "Here is the OTP for verification in Insight Portal",
    text: `Use the OTP: "${otp}" to complete your Sign Up procedures`,
    html: OtpMailTemplate(otp, phone)
})

// console.log(await sentOTP("asdfgh@gmail.com", 123456, "1234567890"))