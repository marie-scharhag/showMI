import React, {FormEvent, useEffect, useRef, useState} from 'react'
import {Form, FormGroup, FormLabel, Modal} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {client} from "../../App";
import styled from "styled-components";
import {Information, Lecture, Room} from "../../Objects";
import {useAuth} from "../../auth/AuthProvider";
import {postInfo} from "../../services/InformationService";
import {useAsyncFn} from "react-use";
import {postDocument} from "../../services/DocumentService";
import {Variant} from "react-bootstrap/types";


interface Props {
    lectures?: Lecture[];
    info?: Information;
    showModal: boolean;
    closeModal: () => void;
    showToastHandler: (content: string, variant: Variant) => void;
}

export function InfoModal({lectures, info, showModal, closeModal, showToastHandler}: Props) {
    const {authTokens} = useAuth();
    const [startDate, setStartDate] = useState(info?.start.split('T')[0]||"")
    const [startTime, setStartTime] = useState(info?.start.split('T')[1].slice(0,5)||"")
    const [endDate, setEndDate] = useState(info?.end.split('T')[0]||"")
    const [endTime, setEndTime] = useState(info?.end.split('T')[1].slice(0,5)||"")
    const [infoState, setInfoState] = useState(info?.info||"")


        const [uploadInfoState, uploadInfo] = useAsyncFn(async (e, startDate: string, endDate: string,startTime:string, endTime:string, infoState:string, lectures:Lecture[]|undefined) => {
        e.preventDefault()
        if(!lectures || !authTokens) return

        const start = new Date(startDate + ' ' + startTime)
        const end = new Date(endDate + ' ' + endTime)

        const info: Information = {
            info: infoState || "",
            start: start.toISOString(),
            end: end.toISOString(),
        }
        console.log(JSON.stringify({info:info,lectures:lectures}), authTokens)

            try {
                await postInfo(info, lectures, authTokens)
                closeModal()
                showToastHandler("Info upload successfully", "success")
            }catch (e) {
                showToastHandler("Error at Info upload", "danger")
            }
    })


    return (
        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Info hinzufügen:</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    {lectures && lectures.map(lecture => (<div>{lecture.lectureName}</div>))}
                    <Form>
                        <FormGroup>
                            <Form.Control type="text" placeholder="Information" value={infoState}
                                          onChange={e => setInfoState(e.target.value)}/>
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

                    </Form>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>Close</Button>
                <Button
                    type="submit"
                    className="submit-button ms-3"
                    onClick={e => uploadInfo(e, startDate, endDate,startTime, endTime, infoState, lectures)}
                >{uploadInfoState.loading ? "Loading...":"Upload"}</Button>
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