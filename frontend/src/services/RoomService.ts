import React from 'react'
import {client} from "../App";
import {Study, Room, JWTToken} from "../Objects";
import {useAuth} from "../auth/AuthProvider";


export async function getAllRooms(authTokens: JWTToken) {
    const response = await client.get(`/api/rooms/`, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}

export async function getRoomsInStudy(study: string, authTokens: JWTToken) {
    const response = await client.get(`/api/rooms/study/${study}`, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}

export async function saveRoomChanges(room: Room, authTokens: JWTToken) {
    const response = await client.put(`/api/rooms/${room.roomNr}/`, room, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}

export async function createRoom(room: Room, authTokens: JWTToken) {
    const response = await client.post(`/api/rooms/`, room, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}