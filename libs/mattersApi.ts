import { API_URL, getHeader } from "../utils/apiSettings";

export const getMatters = async (): Promise<any> => {
    return await fetch(`${API_URL}/matters`, {
        method: 'POST',
        headers: getHeader(),
        body: JSON.stringify({})
    }).then(response => response.json()).catch(() => null)
}

export const createMatter = async (matter: any): Promise<any> => {
    return await fetch(`${API_URL}/matters/create`, {
        method: 'POST',
        headers: getHeader(),
        body: JSON.stringify({ ...matter })
    }).then(response => response.json()).catch(() => null)
}

export const saveMatter = async (matterId: number, matter: any): Promise<any> => {
    return await fetch(`${API_URL}/matters/${matterId}`, {
        method: 'PUT',
        headers: getHeader(),
        body: JSON.stringify({ ...matter })
    }).then(response => response.json()).catch(() => null)
}

export const deleteMatter = async (matterId: number): Promise<any> => {
    return await fetch(`${API_URL}/matters/${matterId}`, {
        method: 'DELETE',
        headers: getHeader(),
    }).then(response => response.json()).catch(() => null)
}