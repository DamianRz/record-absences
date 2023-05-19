import React from "react"
import { USER_TYPES } from "../constants/users"


const USER = "user"

export const setUserLogged = (value: number | string) => {
    window.localStorage.setItem(USER, String(value))
}

export const getUserLogged = async (window: any) => {
    return await window.localStorage.getItem(USER)
}

export const userIsNormal = async (window: any) => {
    return await getUserLogged(window) === USER_TYPES[0].value
}

export const userIsAdmin = async (window: any) => {
    return await getUserLogged(window) === USER_TYPES[1].value
}

export const userIsOwner = async (window: any) => {
    return await getUserLogged(window) === USER_TYPES[2].value
}
