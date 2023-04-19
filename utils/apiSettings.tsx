export const API_URL = process.env.API_URL || 'http://192.168.2.212:3000/api';

export const getHeader = (allowMethods = 'GET, POST, PUT, DELETE, OPTIONS') => {
    const token = window.localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': allowMethods,
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Authorization': `Bearer ${token}`
    }
}
