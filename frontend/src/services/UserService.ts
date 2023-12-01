import React from 'react'
import {JWTToken, Room, UserObject} from "../Objects";
import {client} from "../App";
import {useAsyncFn} from "react-use";


export async function changePW(user: UserObject, authTokens: JWTToken, oldPassword: string, newPassword: string) {
    const response = await client.post(`/api/users/change-password/${user.id}/`, {oldPassword, newPassword}, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}

export async function getAllUsersInStudy(study: string, authTokens: JWTToken) {
    const response = await client.get(`/api/users/${study}`, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}

export async function getAllUsers(authTokens: JWTToken) {
    const response = await client.get(`/api/users`, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}

export async function registerUser(formData:FormData, authTokens:JWTToken){
    const response = await client.post(`/api/register/`, formData,{
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}

export async function editUser(user:UserObject, authTokens:JWTToken){
    const response = await client.put(`/api/users/${user.id}`, user,{
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}