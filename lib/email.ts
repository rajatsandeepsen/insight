import type { AllDepartments, AllYears, SJCET } from "./type";

/**
 * eg: username2025@ai.sjcetpalai.ac.in
 */
const studentsRegex = /^([a-zA-Z]+)([0-9]{4})@([a-zA-Z]+)\.sjcetpalai\.ac\.in$/;
/**
 * eg: username2025.ecs@sjcetpalai.ac.in
 */
const otherStudentsRegex = /^([a-zA-Z]+)([0-9]{4})\.([a-zA-Z]+)@sjcetpalai\.ac\.in$/;

/**
 * eg: username@sjcetpalai.ac.in
 */
const globalEmailCase = /^([a-zA-Z]+)@sjcetpalai\.ac\.in$/;

type ReturnGetDataFromMail = {
    isSJCET: true;
    data: SJCET
} | {
    isSJCET: false;
    data: null;
}

export const getDataFromMail = (mail: string):ReturnGetDataFromMail => {
    const email = mail.trim().toLowerCase();
    const isSJCET = email.endsWith('sjcetpalai.ac.in');

    if (isSJCET) {
        const match = email.match(studentsRegex);

        if (match !== null) {
            const data: SJCET = {
                year: (match[2] as AllYears) ?? 'NA',
                department: (match[3] as AllDepartments) === 'es' ? 'ecs' : (match[3] as AllDepartments) ?? 'NA',
                college: 'SJCET',
                role: 'student',
                name: match[1],
                email,
            };
            return { isSJCET, data };
        }

        const otherMatch = email.match(otherStudentsRegex);

        if (otherMatch !== null) {
            const data: SJCET = {
                year: (otherMatch[2] as AllYears) ?? 'NA',
                department: (otherMatch[3] as AllDepartments) === 'es' ? 'ecs' : (otherMatch[3] as AllDepartments) ?? 'NA',
                college: 'SJCET',
                role: 'student',
                name: otherMatch[1],
                email,
            };
            return { isSJCET, data };
        }

        const facultyMatch = email.match(globalEmailCase);

        if (facultyMatch) {
            const data: SJCET = {
                year: "NA",
                department: "NA",
                college: 'SJCET',
                role: 'student',
                name: facultyMatch[1],
                email,
            }
            return { isSJCET, data };
        }

        return { isSJCET:false, data: null };
    }
    return { isSJCET, data: null };
};


/**
 * 910000111100 to 0000111100
 */

export const extractNumber = (number:string) => {
    const n = number.trim().replace(/\D/g, '');

    if (n.length !== 12) throw new Error("Mobile number is not 10 digits")

    if (n.startsWith("91")) return n.slice(2)

    throw new Error("Number outside India is not permitted yet")
}