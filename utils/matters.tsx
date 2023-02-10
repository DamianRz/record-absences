import { getMatters } from "../libs/mattersApi"

export const getStoreMatters = () => {
    return JSON.parse(localStorage.getItem("matters") || "[]")
}

export const setStoreMatters = async () => {
    const response: any = await getMatters()
    localStorage.setItem("matters", JSON.stringify(response))
    return response
}
