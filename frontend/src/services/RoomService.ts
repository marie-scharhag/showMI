import {client} from "../App";
import {Study, Room, JWTToken} from "../Objects";

/**
 * Retrieves all rooms from the server.
 *
 * @param authTokens - JWT authentication tokens for authorization.
 * @returns A Promise representing the response from the server.
 */
export async function getAllRooms(authTokens: JWTToken) {
    const response = await client.get(`/api/rooms/all`, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}

/**
 * Retrieves rooms associated with a specific study from the server.
 *
 * @param study - The study for which rooms are to be retrieved.
 * @param authTokens - JWT authentication tokens for authorization.
 * @returns A Promise representing the response from the server.
 */
export async function getRoomsInStudy(study: string, authTokens: JWTToken) {
    const response = await client.get(`/api/rooms/study/${study}`, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}

/**
 * Saves changes to an existing room on the server.
 *
 * @param room - The room with changes to be saved.
 * @param authTokens - JWT authentication tokens for authorization.
 * @returns A Promise representing the response from the server.
 */
export async function saveRoomChanges(room: Room, authTokens: JWTToken) {
    const response = await client.put(`/api/rooms/${room.roomNr}/`, room, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}

/**
 * Creates a new room on the server.
 *
 * @param room - The room to be created.
 * @param authTokens - JWT authentication tokens for authorization.
 * @returns A Promise representing the response from the server.
 */
export async function createRoom(room: Room, authTokens: JWTToken) {
    const response = await client.post(`/api/rooms/new/`, room, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}