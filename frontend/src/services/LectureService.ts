import {JWTToken, Lecture, Room, UserObject} from "../Objects";
import {client} from "../App";

/**
 * Retrieves all lectures associated with a specific room from the server.
 *
 * @param room - The room for which lectures are to be retrieved.
 * @param authTokens - JWT authentication tokens for authorization.
 * @returns A Promise representing the response from the server.
 */
export async function getLecturesInRoom(room: Room, authTokens: JWTToken) {
    const response = await client.get(`/api/lectures/${room.roomNr}/all`, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}
/**
 * Retrieves the image associated with a specific lecture and room from the server.
 *
 * @param lecture - The lecture for which the image is to be retrieved.
 * @param room - The optional room for which the image is associated.
 * @param authTokens - JWT authentication tokens for authorization.
 * @returns A Promise representing the response from the server.
 */
export async function getImageForLecture(lecture: Lecture, room: Room | undefined, authTokens: JWTToken) {
    const urlPath = room ? `/api/lectures/image/${lecture.id}/${room.roomNr}` : `/api/lectures/image/${lecture.id}`;

    const response = await client.get(urlPath, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        },
        responseType: 'arraybuffer',
    })
    return response
}

/**
 * Retrieves all lectures associated with a specific teacher from the server.
 *
 * @param user - The user (teacher) for which lectures are to be retrieved.
 * @param authTokens - JWT authentication tokens for authorization.
 * @returns A Promise representing the response from the server.
 */
export async function getLecturesForTeacher(user: UserObject, authTokens: JWTToken) {
    const response = await client.get(`/api/lectures/user/${user.id}/all`, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}

/**
 * Posts a new lecture to the server.
 *
 * @param formData - Form data containing information about the new lecture.
 * @param authTokens - JWT authentication tokens for authorization.
 * @returns A Promise representing the response from the server.
 */
export async function postLecture(formData: FormData, authTokens: JWTToken) {
    const response = await client.post(`/api/lectures/new/`, formData, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}

/**
 * Updates an existing lecture on the server.
 *
 * @param lectureId - The ID of the lecture to be updated.
 * @param lectureObject - The updated lecture object.
 * @param authTokens - JWT authentication tokens for authorization.
 * @returns A Promise representing the response from the server.
 */
export async function putLecture(lectureId: number, lectureObject: Lecture, authTokens: JWTToken) {
    const response = await client.put(`/api/lectures/${lectureId}/`, lectureObject, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}

/**
 * Deletes a lecture from the server.
 *
 * @param lectureId - The ID of the lecture to be deleted.
 * @param authTokens - JWT authentication tokens for authorization.
 * @returns A Promise representing the response from the server.
 */
export async function deleteLecture(lectureId: number, authTokens: JWTToken) {
    const response = await client.delete(`/api/lectures/${lectureId}/`, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}







