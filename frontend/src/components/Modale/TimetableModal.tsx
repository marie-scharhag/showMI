import styled from "styled-components";
import {FloatingLabel, Form, FormGroup, FormLabel, FormSelect, Modal} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import React, {FormEvent, useEffect, useState} from "react";
import {useAsyncFn} from "react-use";
import {client} from "../../App";
import {useAuth} from "../../auth/AuthProvider";
import {Room} from "../../Objects";
import {createRoom} from "../../services/RoomService";
import {postTimetable} from "../../services/TimetableService";
import {Variant} from "react-bootstrap/types";


interface Props {
    showModal: boolean;
    closeModal: () => void;
    showToastHandler: (content: string, variant: Variant) => void;
}

export function TimetableModal({showModal, closeModal, showToastHandler}: Props) {
    const {authTokens} = useAuth();
    const [title, setTitle] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [fileValue, setFileValue] = useState<File>()
    const handleRoomChange = (value: string[]) => {
        console.log(value)
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        setFileValue(selectedFile);
    };

    const [uploadTimetableState, uploadTimetable] = useAsyncFn(async (e, fileValue: File | undefined, startDate: string, endDate: string, title: string) => {
        e.preventDefault()
        if (!fileValue || !authTokens) return
        const formData = new FormData();
        formData.append('timetable_data', fileValue);
        formData.append('semester_start', startDate);
        formData.append('semester_end', endDate);
        formData.append('semester_name', title)

        try {
            await postTimetable(formData, authTokens)
            closeModal()
            showToastHandler("Timetbale upload successfully", "success")
        } catch (e) {
            closeModal()
            showToastHandler("Error at Timetbale upload", "danger")
        }
    })

    //   const handleUpload = (e:FormEvent) => {
    //       e.preventDefault()
    //       if (fileValue) {
    //           const formData = new FormData();
    //           formData.append('timetable_data', fileValue);
    //           formData.append('semester_start', startDate);
    //           formData.append('semester_end', endDate);
    //           formData.append('semester_name',title)
    //
    //           console.log(formData)
    //           client.post('/api/timetable/', formData, {
    //               headers: {
    //                   'Content-Type': 'multipart/form-data',
    //                   'Authorization': `Bearer ${authTokens?.access}`
    //               }
    //           })
    //               .then((response) => {
    //                 console.log('Upload erfolgreich:', response.data);
    //               }).catch((error) => {
    //                 console.error('Fehler beim Upload:', error);
    //               });
    //       }
    // };

    return (
        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Stundenplan hochladen</Modal.Title>
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
                        </FormGroup>
                        <FormGroup className="my-3 date-time-picker">
                            <FormLabel label="End">Bis</FormLabel>
                            <Form.Control className="" type="date" value={endDate}
                                          onChange={(e) => setEndDate(e.target.value)}/>
                        </FormGroup>
                        <Form.Group controlId="formFile" className="mb-3 px-3">
                            {/*<Form.Label>aktuellen Stundenplan hochladen</Form.Label>*/}
                            <input accept={".csv"} type="file" onChange={(e) => handleFileChange(e)}/>
                        </Form.Group>
                    </Form>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>Close</Button>
                <Button
                    type="submit"
                    className="submit-button ms-3"
                    onClick={e => uploadTimetable(e, fileValue, startDate, endDate, title)}
                >{uploadTimetableState.loading ? "Loading..." : "Upload"}</Button>
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