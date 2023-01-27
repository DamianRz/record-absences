export const getProfessor = async (ci: number): Promise<{ id: number, personId: number, active: boolean } | undefined> => {
    const apiUrl = process.env.API_URL || 'http://26.80.200.141:3000'
    const token = localStorage.getItem('token');
    const response = await fetch(`${apiUrl}/proffessors`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ person: { ci } })
    });
    const data = await response.json();
    if (data.length > 0) {
        return { id: data[0].id, personId: data[0].personId, active: data[0].active }
    } else {
        return undefined;
    }
}
