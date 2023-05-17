import { API_URL, getHeader } from "../utils/apiSettings";

export const getGroups = async (groupFilters: any): Promise<any> => {
    return await fetch(`${API_URL}/groups`, {
        method: 'POST',
        headers: getHeader(),
        body: JSON.stringify({ ...groupFilters })
    }).then(response => response.json())
}

export const createGroup = async (group: any): Promise<any> => {
    return await fetch(`${API_URL}/groups/create`, {
        method: 'POST',
        headers: getHeader(),
        body: JSON.stringify({ ...group })
    }).then(response => response.json())
}

export const deleteGroup = async (groupId: number): Promise<any> => {
    return await fetch(`${API_URL}/groups/${groupId}`, {
        method: 'DELETE',
        headers: getHeader(),
    }).then(response => response.json())
}

export const saveGroup = async (groupId: number, groupData: any): Promise<any> => {
    return await fetch(`${API_URL}/groups/${groupId}`, {
        method: 'PUT',
        headers: getHeader(),
        body: JSON.stringify({ ...groupData })
    }).then(response => response.json())
}
