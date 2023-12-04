import React from 'react'
import {JWTToken, Room, UserObject} from "../Objects";
import {client} from "../App";
import {useAsyncFn} from "react-use";

/**
 * Changes the password for the specified user.
 *
 * @param user - The user object for which the password is to be changed.
 * @param authTokens - JWT authentication tokens for authorization.
 * @param oldPassword - The old password.
 * @param newPassword - The new password.
 * @returns A Promise representing the response from the server.
 */
export async function changePW(user: UserObject, authTokens: JWTToken, oldPassword: string, newPassword: string) {
    const response = await client.post(`/api/users/change-password/${user.id}/`, {oldPassword, newPassword}, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}

/**
 * Retrieves all users in a specific study from the server.
 *
 * @param study - The name of the study.
 * @param authTokens - JWT authentication tokens for authorization.
 * @returns A Promise representing the response from the server.
 */
export async function getAllUsersInStudy(study: string, authTokens: JWTToken) {
    const response = await client.get(`/api/users/${study}`, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}

/**
 * Retrieves all users from the server.
 *
 * @param authTokens - JWT authentication tokens for authorization.
 * @returns A Promise representing the response from the server.
 */
export async function getAllUsers(authTokens: JWTToken) {
    const response = await client.get(`/api/users/all`, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}

/**
 * Registers a new user on the server.
 *
 * @param formData - Form data containing the user information.
 * @param authTokens - JWT authentication tokens for authorization.
 * @returns A Promise representing the response from the server.
 */
export async function registerUser(formData:FormData, authTokens:JWTToken){
    const response = await client.post(`/api/users/register/`, formData,{
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}

/**
 * Edits an existing user on the server.
 *
 * @param user - The user object with updated information.
 * @param authTokens - JWT authentication tokens for authorization.
 * @returns A Promise representing the response from the server.
 */
export async function editUser(user:UserObject, authTokens:JWTToken){
    const response = await client.put(`/api/users/${user.id}`, user,{
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}