import type { AllYears } from "./type";




export const isStudent = (year: AllYears) => {
	if (year === "NA") return false

	const currentYear = new Date().getFullYear()
	const passOutYear = Number.parseInt(year)

	if (currentYear < passOutYear) return true
	return false
}