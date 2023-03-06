export const getAbsences = async (active: boolean): Promise<any> => {
    const apiUrl = process.env.API_URL || 'http://localhost:3000/api'
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
        body: JSON.stringify({ active: active })
    }).then(response => response.json())
}

export const createAbsence = async (absenceData: any): Promise<any> => {
    const apiUrl = process.env.API_URL || 'http://localhost:3000/api'
    const token = localStorage.getItem('token');
    return await fetch(`${apiUrl}/absences/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...absenceData })
    }).then(response => response.json())
}

export const saveAbsence = async (absenceId: number, absenceData: any): Promise<any> => {
    const apiUrl = process.env.API_URL || 'http://localhost:3000/api'
    const token = localStorage.getItem('token');
    return await fetch(`${apiUrl}/absences/${absenceId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...absenceData })
    }).then(response => response.json())
}
