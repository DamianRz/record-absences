export const getMatters = async (): Promise<any> => {
    const apiUrl = process.env.API_URL || 'http://localhost:3000/api'
    const token = localStorage.getItem('token');
    return await fetch(`${apiUrl}/matters`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({})
    }).then(response => response.json())
}

export const createMatter = async (matter: any): Promise<any> => {
    const apiUrl = process.env.API_URL || 'http://localhost:3000/api'
    const token = localStorage.getItem('token');
    return await fetch(`${apiUrl}/matters/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...matter })
    }).then(response => response.json())
}

export const saveMatter = async (matterId: number, matter: any): Promise<any> => {
    const apiUrl = process.env.API_URL || 'http://localhost:3000/api'
    const token = localStorage.getItem('token');
    return await fetch(`${apiUrl}/matters/${matterId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PATCH',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...matter })
    }).then(response => response.json())
}

export const deleteMatter = async (matterId: number): Promise<any> => {
    const apiUrl = process.env.API_URL || 'http://localhost:3000/api'
    const token = localStorage.getItem('token');
    return await fetch(`${apiUrl}/matters/${matterId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.json())
}