export const getAbsences = async (): Promise<any> => {
    const apiUrl = process.env.API_URL || 'http://26.80.200.141:3000'
    const token = localStorage.getItem('token');
    return await fetch(`${apiUrl}/absences/all`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Authorization': `Bearer ${token}`
        },
    }).then(response => response.json())
}
