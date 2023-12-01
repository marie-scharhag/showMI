import React, { useEffect, useState} from 'react'
import styled from "styled-components";
import { Stack} from "react-bootstrap";
import {DocumentItem} from "../Items/DocumentItem";
import {useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
import {DocumentModal} from "../Modale/DocumentModal";
import {useAuth} from "../../auth/AuthProvider";
import {useAsyncFn} from "react-use";
import {client} from "../../App";
import {Document} from "../../Objects";
import {getAllDocuments} from "../../services/DocumentService";

export function DocumentsView(){

    const navigate = useNavigate()
    const {authTokens} = useAuth()

    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };


    useEffect(()=>{
        getDocuments()
    },[])

    const [documentsState, getDocuments] = useAsyncFn(async()=>{
        if (!authTokens) return
        const response = await getAllDocuments(authTokens)
            const documents: Array<Document> = response.data
            return documents
    })


    return(
        <Container>
            <Button variant="primary" onClick={openModal}>
                Add Document
            </Button>
            <DocumentModal showModal={showModal} closeModal={closeModal}/>
            <div className="py-4">
                <h3 className="head pb-3">Dokumente</h3>
                {documentsState.loading && <div>loading...</div>}
                {documentsState.error && <div>loading...</div>}
                {documentsState.value &&
                    <Stack gap={2}>
                        {documentsState.value.map((document)=>(<DocumentItem key={document.name} document={document}/>))}
                    </Stack>
                }
            </div>
        </Container>
    )
}

const Container = styled.div`
    background-color: #FBFDFD;
    box-shadow: 0px 3px 20px #E0E0E0;
    border-radius: 10px;
    
    .head{
        text-align: center;
    }
    
    .sub-head{
        display: flex;
    }
    `;