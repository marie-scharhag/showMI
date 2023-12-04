import styled from "styled-components";
import {FloatingLabel, Form, FormGroup, FormLabel, Modal} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import React, {FormEvent, useEffect, useState} from "react";
import {useAuth} from "../../auth/AuthProvider";
import {Room} from "../../Objects";
import {RoomMultiselect} from "../Fields/RoomMultiSelect";
import {postDocument} from "../../services/DocumentService";
import {useAsyncFn} from "react-use";
import {client} from "../../App";
import {Variant} from "react-bootstrap/types";


interface Props {
    showModal: boolean;
    closeModal: () => void;
    showToastHandler: (content: string, variant: Variant) => void;
}

export function DocumentModal({showModal, closeModal, showToastHandler}: Props) {
    const {authTokens} = useAuth();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [title, setTitle] = useState("")
    const [startDate, setStartDate] = useState("")
    const [startTime, setStartTime] = useState("")
    const [endDate, setEndDate] = useState("")
    const [endTime, setEndTime] = useState("")
    const [imageValue, setImageValue] = useState<File>()
    const [onlyDisplay, setOnlyDisplay] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const image = e.target.files?.[0]
        setImageValue(image)
    }

    const [uploadDocumentState, uploadDocument] = useAsyncFn(async (e, imageValue: File | undefined, title: string, startDate: string, endDate: string, onlyDisplay: boolean, rooms: Room[]) => {
        e.preventDefault()
        if (!authTokens || !imageValue || !rooms) return
        const start = new Date(startDate + ' ' + startTime)
        const end = new Date(endDate + ' ' + endTime)


        const formData = new FormData();
        formData.append('documentData', imageValue);
        formData.append('name', title);
        formData.append('start', start.toISOString());
        formData.append('end', end.toISOString());
        formData.append('onlyDisplay', onlyDisplay.toString())
        rooms.forEach((room: Room, index) => {
            formData.append(`room_nrs`, `${room.roomNr}`);
        });

        try{
            await postDocument(formData, authTokens)
            closeModal()
            showToastHandler("Document upload successfully", "success")
        }catch (e) {
            showToastHandler("Error at Document upload", "danger")
        }

    })


    return (
        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Dokument hinzufügen</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Form>
                        <FormGroup>
                            <Form.Control type="text" placeholder="Titel" value={title}
                                          onChange={e => setTitle(e.target.value)}/>
                        </FormGroup>
                        <FormGroup className="my-3 date-time-picker">
                            <FormLabel label="Start">Von</FormLabel>
                            <Form.Control className="" type="date" value={startDate}
                                          onChange={(e) => setStartDate(e.target.value)}/>
                            <Form.Control type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}/>
                        </FormGroup>
                        <FormGroup className="my-3 date-time-picker">
                            <FormLabel label="End">Bis</FormLabel>
                            <Form.Control className="" type="date" value={endDate}
                                          onChange={(e) => setEndDate(e.target.value)}/>
                            <Form.Control type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)}/>
                        </FormGroup>
                        <Form.Group controlId="formFile" className="mb-3 px-3">
                            {/*<Form.Label>aktuellen Stundenplan hochladen</Form.Label>*/}
                            <input accept={"image/*"} type="file" onChange={(e) => handleFileChange(e)}/>
                        </Form.Group>
                        <FormGroup>
                            <RoomMultiselect rooms={rooms} setRooms={setRooms}/>
                        </FormGroup>
                        <Form.Group className="mb-3">
                            <Form.Check type="checkbox" label="only display" checked={onlyDisplay}
                                        onChange={e => setOnlyDisplay(e.target.checked)}/>
                        </Form.Group>

                    </Form>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>Close</Button>
                <Button onClick={(e) => uploadDocument(e, imageValue, title, startDate, endDate, onlyDisplay, rooms)}
                        type="submit" className="submit-button ms-3">{uploadDocumentState.loading ? "Loading..." : "Upload"}</Button>
            </Modal.Footer>
        </Modal>
    )

}

const Container = styled.div`
  .date-time-picker {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;