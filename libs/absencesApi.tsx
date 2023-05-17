import { IAbsence } from "../constants/absences"
import { API_URL, getHeader } from "../utils/apiSettings"

export const getAbsences = async (active: boolean): Promise<IAbsence[]> => {
    return await fetch(`${API_URL}/absences/all`, {
        method: 'POST',
        headers: getHeader(),
        body: JSON.stringify({ active: active })
    }).then(response => response.json())
}

export const createAbsence = async (absenceData: any): Promise<any> => {
    return await fetch(`${API_URL}/absences/create`, {
        method: 'POST',
        headers: getHeader(),
        body: JSON.stringify({ ...absenceData })
    }).then(response => response.json())
}

export const saveAbsence = async (absenceId: number, absenceData: any): Promise<any> => {
    return await fetch(`${API_URL}/absences/${absenceId}`, {
        method: 'PUT',
        headers: getHeader(),
        body: JSON.stringify({ ...absenceData })
    }).then(response => response.json())
}
