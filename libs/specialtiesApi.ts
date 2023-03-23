export const getSpecialtiesByTeacher = async (teacherId: number): Promise<any> => {
    const apiUrl = process.env.API_URL || 'http://192.168.2.212:3000/api'
    const token = localStorage.getItem('token');
    return await fetch(`${apiUrl}/specialties/all`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ proffessorId: teacherId })
    }).then(response => response.json())
}

export const getSpecialties = async (teacherId: number): Promise<any> => {
    const apiUrl = process.env.API_URL || 'http://192.168.2.212:3000/api'
    const token = localStorage.getItem('token');
    return await fetch(`${apiUrl}/specialties`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({})
    }).then(response => response.json())
}

export const createSpecialty = async (specialty: any): Promise<any> => {
    const apiUrl = process.env.API_URL || 'http://localhost:3000/api'
    const token = localStorage.getItem('token');
    return await fetch(`${apiUrl}/specialties/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...specialty })
    }).then(response => response.json())
}

export const removeSpecialty = async (specialtyId: any): Promise<any> => {
    const apiUrl = process.env.API_URL || 'http://localhost:3000/api'
    const token = localStorage.getItem('token');
    return await fetch(`${apiUrl}/specialties/${specialtyId}`, {
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

export const updateSpecialties = async (createSpecialties: any, removeSpecialtyIds: any) => {
    Promise.all([
        ...createSpecialties.map(async (specialty: any) => {
            await createSpecialty(specialty)
        }),
        ...removeSpecialtyIds.map(async (specialtyId: any) => {
            await removeSpecialty(specialtyId)
        })
    ]);
}
