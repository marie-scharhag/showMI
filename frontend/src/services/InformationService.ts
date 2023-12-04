import {Document, Information, JWTToken, Lecture} from "../Objects";
import {client} from "../App";

/**
 * Posts new information (info) associated with multiple lectures to the server.
 *
 * @param info - The information object to be posted.
 * @param lectures - An array of lecture objects to associate with the information.
 * @param authTokens - JWT authentication tokens for authorization.
 * @returns A Promise representing the response from the server.
 */
export async function postInfo(info:Information,lectures: Lecture[], authTokens: JWTToken) {
    const response = await client.post('/api/info/new/', JSON.stringify({info:info,lectures:lectures}),{
                headers: {
                    'Authorization': `Bearer ${authTokens?.access}`,
                    'Content-Type': 'application/json',
                },
            })
    return response
}