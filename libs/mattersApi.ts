export const getMatters = async (): Promise<any> => {
    const apiUrl = process.env.API_URL || 'http://localhost:3000'
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
