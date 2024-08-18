import { generateOTP } from "@/lib/otp";
import { prefixRedis, redisClient } from "./client";
import type { AllDepartments, AllYears, SJCET, UserOtp } from "@/lib/type";
import { getDataFromMail } from "@/lib/email";


export const isStudent = (year: AllYears) => {
    if (year === "NA") return false

    const currentYear = new Date().getFullYear()
    const passOutYear = Number.parseInt(year)

    if (currentYear < passOutYear) return true
    return false
}

export class User {
    private key: string;

    constructor(public data: SJCET, public number: string) {
        this.data = data;

        this.number = number;
        const { key } = User.setKey(number);

        this.key = key
    }

    private static setKey(number: string) {
        const key = `${prefixRedis}user:${number}`;
        const otpkey = `${prefixRedis}user:otp:${number}`;

        return { otpkey, key }
    }

    async updateCache() {
        const res = await redisClient.set<SJCET>(this.key, this.data);
        return !!res
    }

    static async get(number: string) {
        const { key } = this.setKey(number);
        const data = await redisClient.get<SJCET>(key);
        if (!data) return null;

        return new this(data, number);
    }

    private async delete() {
        await redisClient.del(this.key);
    }

    async updatePartial({ department, name, year }: Partial<Pick<SJCET, "department" | "name" | "year">>) {
        if (name) this.data.name = name;
        this.data.department = department ?? "NA"
        this.data.year = year ?? "NA"

        await this.updateCache();
    }

    static async createAccount(data: SJCET, number: string) {
        const otp = generateOTP()
        console.log(otp)
        const { otpkey } = this.setKey(number);
        const res = await redisClient.set<UserOtp>(otpkey, {
            otp,
            email: data.email
        });
        return !!res
    }

    static async verify(otp: number, number: string) {
        const { otpkey } = this.setKey(number);

        const res = await redisClient.get<UserOtp>(otpkey)

        if (!res) return null
        
        if (res.otp !== otp) return null
        
        const {data, isSJCET} = getDataFromMail(res.email)
        
        if (!isSJCET) return null

        const user = new this(data, number)
        user.updateCache()

        redisClient.del(otpkey)

        return user
    }

    static async logout(number: string) {
        const { key } = this.setKey(number);

        const res = await redisClient.del(key)

        return !!res
    }
}


// const { isSJCET, data } = getDataFromMail("asdfg2025@ai.sjcetpalai.ac.in")

// if (isSJCET) {
//     const std = new User({ ...data }, "1234567890")
//     console.log(std, await std.updateCache())
// }

// const std = await User.get("1234567890")
// console.log(std?.data)