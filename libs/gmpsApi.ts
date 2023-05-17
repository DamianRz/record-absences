import { API_URL, getHeader } from "../utils/apiSettings";

export const getGMP = async (professorId: number | null, gmp: any): Promise<any> => {
    let body = { ...gmp }
    if (professorId !== null) {
        body = { ...body, "proffessorId": professorId }
    }
    const response = await fetch(`${API_URL}/gmps`, {
        method: 'POST',
        headers: getHeader(),
        body: JSON.stringify({ ...body })
    });
    const data = await response.json();
    if (data.length > 0) {
        return data
    } else {
        return [];
    }
}

export const createGmp = async (gmp: any): Promise<any> => {
    return await fetch(`${API_URL}/gmps/create`, {
        method: 'POST',
        headers: getHeader(),
        body: JSON.stringify({ ...gmp })
    }).then(response => response.json())
}

export const saveGmp = async (gmpId: number, gmp: any): Promise<any> => {
    return await fetch(`${API_URL}/gmps/${gmpId}`, {
        method: 'PUT',
        headers: getHeader(),
        body: JSON.stringify({ ...gmp })
    }).then(response => response.json())
}

export const deleteGmp = async (gmpId: number): Promise<any> => {
    return await fetch(`${API_URL}/gmps/${gmpId}`, {
        method: 'DELETE',
        headers: getHeader()
    }).then(response => response.json())
}
