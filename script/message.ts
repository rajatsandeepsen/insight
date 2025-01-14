import { dataZod, type CertificateZod } from "./validation";

// export const getMessages = (data:CertificateZod[0] ) => {
//     const { name, checked, feedback } = data
//     return `Hello  ${name}! 

// ${!checked ? "Looks like you registered the FOSSDAY event and didn't scanned the tickets at venue. \n\nPlease fill this form before 19th for generating your digital certificate."
//            :  !feedback ? "We are waiting for your feedback on the event. Please fill this form before 19th for generating your digital certificate."
//                         : "" }

// Registration Status: ✅
// Checked In: ${checked ? "✅" : "❌"}
// Feedback Status: ${feedback ? "✅" : "❌"}
// Qualification status for certificate: ${checked && feedback ? "✅" : "❌"}

// Link: https://nexus.sjcetpalai.ac.in/fossday/feedback/final

// > Please feel free to reach out to us if you have any queries.`
// }

export const getMessages = (data:CertificateZod[0] ) => {
    const { name } = data
    return `Hello  ${name}! 👋 <br> <br>

Thank you for participating in the event. Here is your certificate of participation. 🎉<br> <br>

> Please feel free to reach out to us if you have any queries. <br><br>
 
The Nexus Project <br>
SJCET Palai` as const
}