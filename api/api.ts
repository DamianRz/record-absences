import axios from "axios";

const BASE_URL = process.env.BASE_URL;

export const callGET = async (url: string) => {
    return await axios.get(`${BASE_URL}${url}`)
}

export const callPOST = async (url: string, data: any) => {
    return await axios.post(`${BASE_URL}${url}`, data)
}
