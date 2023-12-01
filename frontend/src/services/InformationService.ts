import {Document, Information, JWTToken, Lecture} from "../Objects";
import {client} from "../App";


export async function postInfo(info:Information,lectures: Lecture[], authTokens: JWTToken) {
    const response = await client.post('/api/info/', JSON.stringify({info:info,lectures:lectures}),{
                headers: {
                    'Authorization': `Bearer ${authTokens?.access}`,
                    'Content-Type': 'application/json',
                },
            })
    return response
}