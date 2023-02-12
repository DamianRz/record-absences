export const getMgById = async (mgId: number): Promise<any> => {
    const apiUrl = process.env.API_URL || 'http://localhost:3000'
    const token = localStorage.getItem('token');
    return await fetch(`${apiUrl}/mgs/${mgId}/all`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Authorization': `Bearer ${token}`
        },
    }).then(response => response.json());
}

export const getMgs = async (filters: any): Promise<any> => {
    const apiUrl = process.env.API_URL || 'http://localhost:3000'
    const token = localStorage.getItem('token');
    return await fetch(`${apiUrl}/mgs/all`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...filters })
    }).then(response => response.json());
}