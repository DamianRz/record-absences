export const getGmps = async (proffessorId: number): Promise<any> => {
    const apiUrl = process.env.API_URL || 'http://26.80.200.141:3000'
    const token = localStorage.getItem('token');
    return await fetch(`${apiUrl}/gmps/${proffessorId}/all`, {
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


export const getGMP = async (proffessorId: number): Promise<any> => {
    const apiUrl = process.env.API_URL || 'http://26.80.200.141:3000'
    const token = localStorage.getItem('token');
    const response = await fetch(`${apiUrl}/gmps`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ proffessorId })
    });
    const data = await response.json();
    if (data.length > 0) {
        return data
    } else {
        return undefined;
    }
}
