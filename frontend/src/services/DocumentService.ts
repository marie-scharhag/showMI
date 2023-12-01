import React from 'react'
import {client} from "../App";
import {JWTToken, Room} from "../Objects";
import {useAuth} from "../auth/AuthProvider";
import {Document} from "../Objects";


export async function getDocumentsInRoom(room: Room, authTokens: JWTToken) {
    const response = await client.get(`/api/documents/room/${room.roomNr}/`, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}


export async function getAllDocuments(authTokens: JWTToken) {
    const response = await client.get(`/api/documents`, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}

export async function postDocument(formData: FormData, authTokens: JWTToken) {
    const response = client.post('/api/documents/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}

export async function putDocument(documentId:number,document: Document, authTokens: JWTToken) {
    const response = await client.put(`/api/documents/${documentId}/`, document, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}

export async function deleteDocument(document: Document, authTokens: JWTToken) {
    const response = await client.delete(`/api/documents/${document.id}/`, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${authTokens.access}`,
        }
    })
    return response
}





