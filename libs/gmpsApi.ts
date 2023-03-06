export const getGMP = async (professorId: number | null, gmp: any): Promise<any> => {
    const apiUrl = process.env.API_URL || 'http://localhost:3000/api'
    const token = localStorage.getItem('token');
    let body = { ...gmp }
    if (professorId !== null) {
        body = { ...body, "proffessorId": professorId }
    }
    const response = await fetch(`${apiUrl}/gmps`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Authorization': `Bearer ${token}`
        },
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
    const apiUrl = process.env.API_URL || 'http://localhost:3000/api'
    const token = localStorage.getItem('token');
    return await fetch(`${apiUrl}/gmps/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...gmp })
    }).then(response => response.json())
}

export const saveGmp = async (gmpId: number, gmp: any): Promise<any> => {
    const apiUrl = process.env.API_URL || 'http://localhost:3000/api'
    const token = localStorage.getItem('token');
    return await fetch(`${apiUrl}/gmps/${gmpId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PATCH',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...gmp })
    }).then(response => response.json())
}

export const deleteGmp = async (gmpId: number): Promise<any> => {
    const apiUrl = process.env.API_URL || 'http://localhost:3000/api'
    const token = localStorage.getItem('token');
    return await fetch(`${apiUrl}/gmps/${gmpId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Authorization': `Bearer ${token}`
        },
    }).then(response => response.json())
}
