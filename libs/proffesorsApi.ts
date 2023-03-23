export const getProfessor = async (ci: number): Promise<any> => {
    const apiUrl = process.env.API_URL || 'http://192.168.2.212:3000/api'
    const token = localStorage.getItem('token');
    return await fetch(`${apiUrl}/proffessors`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ci })
    }).then(response => response.json())
}

export const getProfessorInfo = async (proffesorId: number): Promise<any> => {
    const apiUrl = process.env.API_URL || 'http://192.168.2.212:3000/api'
    const token = localStorage.getItem('token');
    return await fetch(`${apiUrl}/proffessors/${proffesorId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Authorization': `Bearer ${token}`
        },
    }).then(response => response.json())
}

export const getProfessors = async (active: boolean): Promise<any> => {
    const apiUrl = process.env.API_URL || 'http://192.168.2.212:3000/api'
    const token = localStorage.getItem('token');
    return await fetch(`${apiUrl}/proffessors`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ active })
    }).then(response => response.json())
}

export const saveProfessor = async (id: number, professor: any): Promise<any> => {
    const apiUrl = process.env.API_URL || 'http://192.168.2.212:3000/api'
    const token = localStorage.getItem('token');
    return await fetch(`${apiUrl}/proffessors/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PUT',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...professor })
    }).then(response => response.json())
}

export const createProfessor = async (professor: any): Promise<any> => {
    const apiUrl = process.env.API_URL || 'http://192.168.2.212:3000/api'
    const token = localStorage.getItem('token');
    return await fetch(`${apiUrl}/proffessors/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...professor })
    }).then(response => response.json())
}