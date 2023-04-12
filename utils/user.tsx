const USER = "user"

export const setUserLogged = (document: number) => {
    localStorage.setItem(USER, String(document))
}

export const getUserLogged = () => {
    return localStorage.getItem(USER)
}