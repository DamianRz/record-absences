import { API_URL, getHeader } from "../utils/apiSettings";

export const getSpecialtiesByTeacher = async (teacherId: number): Promise<any> => {
    return await fetch(`${API_URL}/specialties/all`, {
        method: 'POST',
        headers: getHeader(),
        body: JSON.stringify({ proffessorId: teacherId })
    }).then(response => response.json())
}

export const getSpecialties = async (teacherId: number): Promise<any> => {
    return await fetch(`${API_URL}/specialties`, {
        method: 'POST',
        headers: getHeader(),
        body: JSON.stringify({})
    }).then(response => response.json())
}

export const createSpecialty = async (specialty: any): Promise<any> => {
    return await fetch(`${API_URL}/specialties/create`, {
        method: 'POST',
        headers: getHeader(),
        body: JSON.stringify({ ...specialty })
    }).then(response => response.json())
}

export const removeSpecialty = async (specialtyId: any): Promise<any> => {
    return await fetch(`${API_URL}/specialties/${specialtyId}`, {
        method: 'DELETE',
        headers: getHeader(),
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
