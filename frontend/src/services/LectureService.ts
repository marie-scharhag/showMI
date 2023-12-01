import React from 'react'
import {JWTToken, Lecture, Room, UserObject} from "../Objects";
import {client} from "../App";
import {useAuth} from "../auth/AuthProvider";


export async function getLecturesInRoom(room: Room, authTokens: JWTToken) {
    const response = await client.get(`/api/lectures/${room.roomNr}`, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}

export async function getImageForLecture(lecture: Lecture, room: Room | undefined, authTokens: JWTToken) {
    console.log("GETIMAGES")
    const urlPath = room ? `/api/lectures/image/${lecture.id}/${room.roomNr}` : `/api/lectures/image/${lecture.id}`;

    const response = await client.get(urlPath, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        },
        responseType: 'arraybuffer',
    })
    try {
        const base64 = btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
        return base64
    } catch (e) {
        console.error('Error while loading Image:', e);
    }
}

export async function getLecturesForTeacher(user: UserObject, authTokens: JWTToken) {
    const response = await client.get(`/api/lectures/user/${user.id}`, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}

export async function postLecture(formData: FormData, authTokens: JWTToken) {
    const response = await client.post(`/api/lectures/`, formData, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}


export async function putLecture(lectureId: number, lectureObject: Lecture, authTokens: JWTToken) {
    const response = await client.put(`/api/lectures/${lectureId}/`, lectureObject, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}


export async function deleteLecture(lectureId: number, authTokens: JWTToken) {
    const response = await client.delete(`/api/lectures/${lectureId}/`, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}







