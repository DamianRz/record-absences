import { API_URL, getHeader } from "../utils/apiSettings";

export const getProfessor = async (ci: number): Promise<any> => {
    return await fetch(`${API_URL}/proffessors`, {
        method: 'POST',
        headers: getHeader(),
        body: JSON.stringify({ ci })
    }).then(response => response.json())
}

export const getProfessorInfo = async (proffesorId: number): Promise<any> => {
    return await fetch(`${API_URL}/proffessors/${proffesorId}`, {
        method: 'GET',
        headers: getHeader(),
    }).then(response => response.json())
}

export const getProfessors = async (active: boolean): Promise<any> => {
    return await fetch(`${API_URL}/proffessors`, {
        method: 'POST',
        headers: getHeader(),
        body: JSON.stringify({ active })
    }).then(response => response.json())
}

export const saveProfessor = async (id: number, professor: any): Promise<any> => {
    return await fetch(`${API_URL}/proffessors/${id}`, {
        method: 'PUT',
        headers: getHeader(),
        body: JSON.stringify({ ...professor })
    }).then(response => response.json())
}

export const createProfessor = async (professor: any): Promise<any> => {
    return await fetch(`${API_URL}/proffessors/create`, {
        method: 'POST',
        headers: getHeader(),
        body: JSON.stringify({ ...professor })
    }).then(response => response.json())
}