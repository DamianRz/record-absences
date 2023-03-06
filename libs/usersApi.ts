const apiUrl = process.env.API_URL || 'http://localhost:3000/api'

export const signIn = (ci: number, password: string): Promise<{ token: string }> => {
    return fetch(`${apiUrl}/users/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        body: JSON.stringify({ name: String(ci), password })
    })
        .then(response => response.json())
        .then(data => {
            return { token: data.token };
        }).catch(error => { return error });
}

export const signUp = (ci: number, password: string): Promise<any> => {
    return fetch(`${apiUrl}/users/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        body: JSON.stringify({ name: String(ci), password })
    })
        .then(response => response.json())
        .then(data => {
            return { token: data.token };
        });
}