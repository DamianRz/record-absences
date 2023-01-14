const apiUrl = process.env.API_URL || 'http://26.80.200.141:3000'

export const signin = (ci: number, password: string): Promise<{ token: string }> => {
    return fetch(`${apiUrl}/users/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        body: JSON.stringify({ ci, password })
    })
        .then(response => response.json())
        .then(data => {
            return { token: data.token };
        });
}
