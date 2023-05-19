import { API_URL, getHeader } from "../utils/apiSettings";

export const signIn = (document: number | string, password: string): Promise<{ token: string, type: string }> => {
    return fetch(`${API_URL}/users/signin`, {
        method: 'POST',
        headers: getHeader(),
        body: JSON.stringify({ name: String(document), password })
    })
        .then(response => response.json())
        .then(data => {
            return { token: data.token, type: data.user.type };
        }).catch(error => { return error });
}

export const signUp = (data: any): Promise<any> => {
    return fetch(`${API_URL}/users/signup`, {
        method: 'POST',
        headers: getHeader(),
        body: JSON.stringify({ ...data })
    })
        .then(response => response.json())
        .then(data => {
            return { token: data.token };
        }).catch(() => null);
}

export const getUsers = (active = true) => {
    return fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: getHeader(),
        body: JSON.stringify({ active })
    }).then(response => response.json())
}

export const setUser = (userId: number, values: any) => {
    return fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: getHeader(),
        body: JSON.stringify({ ...values })
    }).then(response => response.json())
}

export const deleteUser = (userId: number) => {
    return fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: getHeader(),
    }).then(response => response.json())
}