const regex = /^([a-zA-Z]+)([0-9]{4})@([a-zA-Z]+)\.sjcetpalai\.ac\.in$/;

export const departments: { [key: string]: string } = {
	ai: "Artificial Intelligence & Data Science",
	// more departments please
};

export const yearLimit = {
	"4": 2024,
	"3": 2025,
	"2": 2026,
	"1": 2027,
};

export const getSJCETData = (email: string) => {
	const match = email.match(regex);
	if (match) {
		const data = {
			name: match[1],
			year: Number.parseInt(match[2]),
			dprt: match[3],
		};
		return data;
	}
	return null;
};

export const validStudent = (data: ReturnType<typeof getSJCETData>) => {
	return data && departments[data.dprt] && data.year > yearLimit["4"] - 1;
};
