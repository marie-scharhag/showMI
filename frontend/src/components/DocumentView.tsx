import React, {useEffect, useState} from 'react'
import styled from "styled-components";
import {ButtonGroup, Col, FloatingLabel, Form, FormGroup, FormLabel, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useLocation, useNavigate} from "react-router-dom";
import {useAsyncFn} from "react-use";
import {client} from "../App";
import {useAuth} from "../auth/AuthProvider";
import {Document, RoomMultiselectOption, Room,} from "../Objects";
import Multiselect from 'multiselect-react-dropdown';
import {RoomMultiselect} from "./Fields/RoomMultiSelect";
import {deleteLecture} from "../services/LectureService";
import {deleteDocument, putDocument} from "../services/DocumentService";

export function DocumentView() {

    const {state} = useLocation();
    const document: Document = state && state.document;
    const {authTokens} = useAuth()
    const navigate = useNavigate()
    const [rooms, setRooms] = useState<Room[]>(document.rooms);
    const [documentName, setDocumentName] = useState(document.name)
    const [startDate, setStartDate] = useState(document.start.split('T')[0])
    const [startTime, setStartTime] = useState(document.start.split('T')[1].slice(0, 5))
    const [endDate, setEndDate] = useState(document.end.split('T')[0])
    const [endTime, setEndTime] = useState(document.end.split('T')[1].slice(0, 5))
    const [onlyDisplay, setOnlyDisplay] = useState(document.onlyDisplay)

    const handleGoBack = () => {
        navigate(-1);
    };

    const [deleteDocumentState, handleDelete] = useAsyncFn(async (e) => {
        e.preventDefault()
        if (!authTokens) return
        await deleteDocument(document, authTokens)
        navigate(-1)
        //TODO ToastComponent Delete Sucess
    })

    const [saveDocumentState, handleSubmit] = useAsyncFn(async (e, documentName:string,rooms:Room[],startDate:string,startTime:string,endDate:string,endTime:string, onlyDisplay:boolean) => {
        e.preventDefault()
        if (!authTokens) return
        const start = new Date(startDate + ' ' + startTime)
        const end = new Date(endDate + ' ' + endTime)
        const documentObjekt = document
        document.name = documentName
        document.rooms = rooms
        document.start = start.toISOString()
        document.end = end.toISOString()
        document.onlyDisplay = onlyDisplay
        try{
            await putDocument(document.id,documentObjekt, authTokens)
            //TODO success ToastComponent
        }catch (e) {
            //TODO error ToastComponent
        }

    })

    return (
        <Container>
            <Row className="mx-3">
                <Col className="left" lg="8">
                    <div className="image-container">
                        {document.documentData &&
                            <img className="image" src={`http://localhost:8000${document.documentData}`}
                                 alt={"Image"}/>}
                    </div>
                </Col>
                <Col lg="4">
                    <Sidebar className="px-3">
                        <h3 className="header py-3">Dokument Ansicht</h3>
                        <Form>
                            <FormGroup className="mb-3">
                                {/*<FloatingLabel label="Veranstaltungsname">*/}
                                <Form.Control type="text" placeholder="Dokument Name" value={documentName}
                                              onChange={(e) => setDocumentName(e.target.value)}/>
                                {/*</FloatingLabel>*/}
                            </FormGroup>
                            <FormGroup className="mb-3">
                                <Form.Control disabled type="text" placeholder="File name"
                                              value={document.documentData.substring(document.documentData.lastIndexOf("/") + 1)}/>
                            </FormGroup>
                            <FormGroup className="my-3 date-time-picker">
                                <FormLabel label="Start">Von</FormLabel>
                                <Form.Control className="" type="date" value={startDate}
                                              onChange={(e) => setStartDate(e.target.value)}/>
                                <Form.Control type="time" value={startTime}
                                              onChange={(e) => setStartTime(e.target.value)}/>
                            </FormGroup>
                            <FormGroup className="my-3 date-time-picker">
                                <FormLabel label="End">Bis</FormLabel>
                                <Form.Control className="" type="date" value={endDate}
                                              onChange={(e) => setEndDate(e.target.value)}/>
                                <Form.Control type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)}/>
                            </FormGroup>
                            <FormGroup className="mb-3">
                                <RoomMultiselect rooms={rooms} setRooms={setRooms}/>
                            </FormGroup>
                            <Form.Group className="mb-3">
                                <Form.Check type="checkbox" label="only display" checked={onlyDisplay}
                                            onChange={e => setOnlyDisplay(e.target.checked)}/>
                            </Form.Group>
                            <div className="buttons">
                                <Button variant="secondary" onClick={handleGoBack}>Zurück</Button>
                                <Button variant="danger" onClick={handleDelete}>Löschen</Button>
                                <Button type="submit" className="submit-button"
                                        onClick={(e)=>handleSubmit(e,documentName,rooms,startDate,startTime,endDate,endTime, onlyDisplay)}>Speichern</Button>
                            </div>
                        </Form>
                    </Sidebar>
                </Col>
            </Row>
        </Container>

    )
}

const Container = styled.div`

  .left {
    align-items: center;
    display: flex;
  }

  .image-container {
    //height: 450px;
    width: 800px;
    background: #FBFDFD;
    overflow: hidden;
  }

  .image {
    width: 100%;
    height: auto;
    display: block;
  }
`;

const Sidebar = styled.div`
  background: #FBFDFD;
  box-shadow: 0px 3px 20px #E0E0E0;
  border-radius: 10px;
  height: calc(100vh - 180px);

  .header {
    text-align: center;
  }

  .buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 65%;
  }

  .submit-button {
    background: #9BC328 !important;
    border-color: #9BC328 !important;
  }

  .date-time-picker {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;