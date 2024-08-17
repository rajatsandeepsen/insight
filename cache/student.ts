import { prefixRedis, redisClient } from "./client";
import type { AllDepartments, AllYears, SJCET } from "@/lib/type";


export const isStudent = (year: AllYears) => {
	if (year === "NA") return false

	const currentYear = new Date().getFullYear()
	const passOutYear = Number.parseInt(year)

	if (currentYear < passOutYear) return true
	return false
}

export class Student {
    private static key: string;

    constructor(public data: SJCET, public number: string) {
        this.data = data;
        this.number = number;
        Student.setKey(number);
    }

    getData() {
        return {
            ...this.data,
            number: this.number
        };
    }

    static setKey(number: string) {
        Student.key = `${prefixRedis}student:${number}`;
    }

    async create() {
        return await redisClient.set(Student.key, this.data);
    }

    static async fetch(number: string) {
        Student.setKey(number);
        const data = await redisClient.get<SJCET>(Student.key);
        if (!data) return null;

        return new Student(data, number);
    }

    async delete() {
        await redisClient.del(Student.key);
    }

    async update({ department, name, year }: Partial<Pick<SJCET, "department" | "name" | "year">>) {
        if (name) this.data.name = name;
        this.data.department = department ?? "NA"
        this.data.year = year ?? "NA"

        await this.create();
    }
}

// const { isSJCET, data } = getDataFromMail("rajatsandeepsen2025@ai.sjcetpalai.ac.in")

// if (isSJCET) {
//     const std = new Student({ ...data, name: "Rajat Sandeep" }, "9846101882")
//     console.log(std, await std.create())
// }

// const std = await Student.fetch("9846101882")
// console.log(std?.getData())