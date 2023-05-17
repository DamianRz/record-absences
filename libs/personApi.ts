import { API_URL, getHeader } from "../utils/apiSettings";

export const getPerson = async (ci: number):
    Promise<{ id: number, name: string, lastname: string, ci: number } | undefined> => {
    return await fetch(`${API_URL}/people`, {
        method: 'POST',
        headers: getHeader(),
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
    return await fetch(`${API_URL}/people/${id}`, {
        method: 'PUT',
        headers: getHeader(),
        body: JSON.stringify({ ...person })
    }).then(response => response.json())
}

export const createPerson = async (person: any): Promise<any> => {
    return await fetch(`${API_URL}/people/create`, {
        method: 'POST',
        headers: getHeader(),
        body: JSON.stringify({ ...person })
    }).then(response => response.json())
}
