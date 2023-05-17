import { API_URL, getHeader } from "../utils/apiSettings";

export const getMgById = async (mgId: number): Promise<any> => {
    return await fetch(`${API_URL}/mgs/${mgId}/all`, {
        method: 'GET',
        headers: getHeader(),
    }).then(response => response.json());
}

export const getMgs = async (filters: any): Promise<any> => {
    return await fetch(`${API_URL}/mgs/all`, {
        method: 'POST',
        headers: getHeader(),
        body: JSON.stringify({ ...filters })
    }).then(response => response.json());
}

export const getMgsBasicIds = async (filters: any): Promise<any> => {
    return await fetch(`${API_URL}/mgs`, {
        method: 'POST',
        headers: getHeader(),
        body: JSON.stringify({ ...filters })
    }).then(response => response.json());
}

export const createMg = async (mg: any): Promise<any> => {
    return await fetch(`${API_URL}/mgs/create`, {
        method: 'POST',
        headers: getHeader(),
        body: JSON.stringify({ ...mg })
    }).then(response => response.json());
}

export const saveMg = async (mgId: number, mg: any): Promise<any> => {
    return await fetch(`${API_URL}/mgs/${mgId}`, {
        method: 'PUT',
        headers: getHeader(),
        body: JSON.stringify({ ...mg })
    }).then(response => response.json());
}

export const deleteMg = async (mgId: number): Promise<any> => {
    return await fetch(`${API_URL}/mgs/${mgId}`, {
        method: 'DELETE',
        headers: getHeader(),
    }).then(response => response.json());
}