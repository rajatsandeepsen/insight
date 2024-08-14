import type { AllDepartments, AllYears, College } from "./data";

/**
 * eg: name2025@ai.sjcetpalai.ac.in
 */
const studentsRegex = /^([a-zA-Z]+)([0-9]{4})@([a-zA-Z]+)\.sjcetpalai\.ac\.in$/;
/**
 * eg: name2025.ecs@sjcetpalai.ac.in
 */
const otherStudentsRegex = /^([a-zA-Z]+)([0-9]{4})\.([a-zA-Z]+)@sjcetpalai\.ac\.in$/;

const globalEmailCase = /^([a-zA-Z]+)@sjcetpalai\.ac\.in$/;

type SJCET = ({
    college: College;
    name: string
    department: AllDepartments;
    year: AllYears;
})

export const getDataFromMail = (email: string) => {
    const SJCET = email.endsWith('sjcetpalai.ac.in');

    if (SJCET) {
        const match = email.match(studentsRegex);

        if (match !== null) {
            const data: SJCET = {
                year: (match[2] as AllYears) ?? 'NA',
                department: (match[3] as AllDepartments) === 'es' ? 'ecs' : (match[3] as AllDepartments) ?? 'NA',
                college: 'SJCET',
                name: match[1],
            };
            return { SJCET, data };
        }

        const otherMatch = email.match(otherStudentsRegex);

        if (otherMatch !== null) {
            const data: SJCET = {
                year: (otherMatch[2] as AllYears) ?? 'NA',
                department: (otherMatch[3] as AllDepartments) === 'es' ? 'ecs' : (otherMatch[3] as AllDepartments) ?? 'NA',
                college: 'SJCET',
                name: otherMatch[1]
            };
            return { SJCET, data };
        }
        
        const facultyMatch = email.match(globalEmailCase);
        
        if (facultyMatch) {
            const data: SJCET = {
                year: "NA",
                department: "NA",
                college: 'SJCET',
                name: facultyMatch[1],
            }
            return { SJCET, data };
        }
    }
    return { SJCET, data: null };
};