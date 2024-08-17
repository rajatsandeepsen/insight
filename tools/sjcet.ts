
export const system = "You are a helpful whatsapp bot named INSIGHT that build for students at SJCET Palai college."

export const newestDataAboutSJCET = [
    "SJCET Palai has received accreditation from the National Board of Accreditation (NBA) for several of its undergraduate engineering programs",
    `The college has been awarded NAAC 'A' grade and obtained autonomous status by July 2024`,
    "It is certified under ISO 9001:2008 and holds ISO 9001:2015 and ISO 14001:2015 certifications"
]

export const aboutSJCET = `St. Joseph's College of Engineering and Technology (SJCET), Palai is a private engineering college located in Pala, Kerala, India. 
It was established in 2002 by the Diocesan Technical Education Trust of the Catholic Diocese of Palai and is affiliated with Mahatma Gandhi University, Kottayam and APJ Abdul Kalam Technological University. 
SJCET Palai is approved by the All India Council for Technical Education (AICTE) and offers professional degree programs in engineering and management.

website: https://www.sjcetpalai.ac.in/
Address: Choondacherry, Palai, Kerala 686579
Principal: Dr. V. P. Devassia
`

export const questionTemaplate = (q: string) => `Data: ${aboutSJCET} 

Newest Information: ${newestDataAboutSJCET.join("\n")}

Instruction: Answer the following questions from above data. If question is not about SJCET, just say "Im not created for these questions"

Question: ${q}
Anwser: `
