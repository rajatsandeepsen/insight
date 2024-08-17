import { prefixRedis, redisClient } from "./client";
import type { AllDepartments, AllYears, SJCET } from "@/lib/type";

export class Faculty {
    private static key: string;

    constructor(public data: SJCET, public number: string) {
        this.data = data;
        this.number = number;
        Faculty.setKey(number);
    }

    getData() {
        return {
            ...this.data,
            number: this.number
        };
    }

    static setKey(number: string) {
        Faculty.key = `${prefixRedis}faculty:${number}`;
    }

    async create() {
        return await redisClient.set(Faculty.key, this.data);
    }

    static async fetch(number: string) {
        Faculty.setKey(number);
        const data = await redisClient.get<SJCET>(Faculty.key);
        if (!data) return null;

        return new Faculty(data, number);
    }

    async delete() {
        await redisClient.del(Faculty.key);
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
//     const std = new Faculty({ ...data, name: "Rajat Sandeep" }, "9846101882")
//     console.log(std, await std.create())
// }

// const std = await Faculty.fetch("9846101882")
// console.log(std?.getData())