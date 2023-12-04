import React from 'react'
import {client} from "../App";
import {JWTToken, Room} from "../Objects";
import {useAuth} from "../auth/AuthProvider";
import {Document} from "../Objects";

/**
 * Retrieves all documents associated with a specific room.
 *
 * @param room - The room object for which documents are retrieved.
 * @param authTokens - JWT authentication tokens for authorization.
 * @returns A Promise representing the response from the server.
 */
export async function getDocumentsInRoom(room: Room, authTokens: JWTToken) {
    const response = await client.get(`/api/documents/room/${room.roomNr}/`, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}

/**
 * Retrieves all documents across all rooms.
 *
 * @param authTokens - JWT authentication tokens for authorization.
 * @returns A Promise representing the response from the server.
 */
export async function getAllDocuments(authTokens: JWTToken) {
    const response = await client.get(`/api/documents/all`, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}

/**
 * Posts a new document to the server.
 *
 * @param formData - Form data containing document information.
 * @param authTokens - JWT authentication tokens for authorization.
 * @returns A Promise representing the response from the server.
 */
export async function postDocument(formData: FormData, authTokens: JWTToken) {
    const response = client.post('/api/documents/new/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}

/**
 * Updates an existing document on the server.
 *
 * @param documentId - The ID of the document to be updated.
 * @param document - The updated document object.
 * @param authTokens - JWT authentication tokens for authorization.
 * @returns A Promise representing the response from the server.
 */
export async function putDocument(documentId:number,document: Document, authTokens: JWTToken) {
    const response = await client.put(`/api/documents/${documentId}/`, document, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`
        }
    })
    return response
}

/**
 * Deletes a document from the server.
 *
 * @param document - The document object to be deleted.
 * @param authTokens - JWT authentication tokens for authorization.
 * @returns A Promise representing the response from the server.
 */
export async function deleteDocument(document: Document, authTokens: JWTToken) {
    const response = await client.delete(`/api/documents/${document.id}/`, {
        headers: {
            'Authorization': `Bearer ${authTokens.access}`,
        }
    })
    return response
}





