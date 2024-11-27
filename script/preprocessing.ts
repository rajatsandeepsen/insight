import resetData from "./reset.json"
import resetInitial from "./fossday-reset.json"

for (const regi of resetData) {
    const ck = resetInitial.find((a, b) => {
        return a.number === regi.number
    })

    if (!ck) console.log(regi)   
}