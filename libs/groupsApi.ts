export const getGroups = async (groupFilters: any): Promise<any> => {
    const apiUrl = process.env.API_URL || 'http://localhost:3000/api'
    const token = localStorage.getItem('token');
    return await fetch(`${apiUrl}/groups`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...groupFilters })
    }).then(response => response.json())
}

export const createGroup = async (group: any): Promise<any> => {
    const apiUrl = process.env.API_URL || 'http://localhost:3000/api'
    const token = localStorage.getItem('token');
    return await fetch(`${apiUrl}/groups/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...group })
    }).then(response => response.json())
}

export const deleteGroup = async (groupId: number): Promise<any> => {
    const apiUrl = process.env.API_URL || 'http://localhost:3000/api'
    const token = localStorage.getItem('token');
    return await fetch(`${apiUrl}/groups/${groupId}`, {
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

export const saveGroup = async (groupId: number, groupData: any): Promise<any> => {
    const apiUrl = process.env.API_URL || 'http://localhost:3000/api'
    const token = localStorage.getItem('token');
    return await fetch(`${apiUrl}/groups/${groupId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PUT',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...groupData })
    }).then(response => response.json())
}