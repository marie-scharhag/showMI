import {JWTToken} from "../Objects";
import {client} from "../App";

export async function getAllTimetables(authTokens: JWTToken) {
    const response = await client.get(`/api/timetable`, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}

export async function postTimetable(formData:FormData, authTokens: JWTToken) {
    const response = await client.post('/api/timetable/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${authTokens.access}`
                }
            })
    return response
}