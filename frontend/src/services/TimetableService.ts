import {JWTToken} from "../Objects";
import {client} from "../App";

/**
 * Retrieves all timetables from the server.
 *
 * @param authTokens - JWT authentication tokens for authorization.
 * @returns A Promise representing the response from the server.
 */
export async function getAllTimetables(authTokens: JWTToken) {
    const response = await client.get(`/api/timetable/all`, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}

/**
 * Posts a new timetable to the server.
 *
 * @param formData - Form data containing the timetable information.
 * @param authTokens - JWT authentication tokens for authorization.
 * @returns A Promise representing the response from the server.
 */
export async function postTimetable(formData:FormData, authTokens: JWTToken) {
    const response = await client.post('/api/timetable/new/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${authTokens.access}`
                }
            })
    return response
}