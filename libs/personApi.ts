export const getPerson = async (ci: number): Promise<{ id: number, name: string, lastname: string, ci: number } | undefined> => {
    const apiUrl = process.env.API_URL || 'http://localhost:3000'
    return await fetch(`${apiUrl}/people`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        body: JSON.stringify({ ci })
    }).then(response => response.json())
        .then(data => {
            if (data.length) {
                data = data[0]
                return { id: data.id, name: data.name, lastname: data.lastname, ci: data.ci };
            }
        });
}

export const savePerson = async (id: number, person: any): Promise<any> => {
    const apiUrl = process.env.API_URL || 'http://localhost:3000'
    const token = localStorage.getItem('token');
    return await fetch(`${apiUrl}/people/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PATCH',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...person })
    }).then(response => response.json())
}

export const createPerson = async (person: any): Promise<any> => {
    const apiUrl = process.env.API_URL || 'http://localhost:3000'
    const token = localStorage.getItem('token');
    return await fetch(`${apiUrl}/people/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...person })
    }).then(response => response.json())
}
