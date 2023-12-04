import {Form, FormGroup, FormLabel, Modal} from "react-bootstrap";
import {RoomMultiselect} from "../Fields/RoomMultiSelect";
import Button from "react-bootstrap/Button";
import React, {FormEvent, useState} from "react";
import styled from "styled-components";
import {Beamer, Information, Lecture, Room} from "../../Objects";
import {BeamerField} from "../Fields/BeamerField";
import {client} from "../../App";
import {useAuth} from "../../auth/AuthProvider";
import {createRoom} from "../../services/RoomService";
import {useAsyncFn} from "react-use";
import {postInfo} from "../../services/InformationService";
import {Variant} from "react-bootstrap/types";

interface Props {
    showModal: boolean;
    closeModal: () => void;
    showToastHandler: (content: string, variant: Variant) => void;
}

export function RoomModal({showModal, closeModal, showToastHandler}: Props) {
    const {authTokens} = useAuth()
    const [roomNr, setRoomNr] = useState("")
    const [floor, setFloor] = useState("")
    const [building, setBuilding] = useState("")

    // const [beamerName, setBeamerName] = useState<Beamer[]>([])


    const [uploadRoomState, uploadRoom] = useAsyncFn(async (e, roomNr: string, floor: string, building: string) => {
        e.preventDefault()
        if (!authTokens) return

        const room: Room = {
            roomNr: roomNr,
            floor: floor,
            building: building,
        }

        try {
            await createRoom(room, authTokens)
            closeModal()
            showToastHandler("Room upload successfully", "success")
        } catch (e) {
            showToastHandler("Error at Room upload", "danger")
        }
    })

    return (
        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Raum erstellen</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Form>
                        <FormGroup className="mb-3">
                            <Form.Control type="text" placeholder="Room Number" value={roomNr}
                                          onChange={e => setRoomNr(e.target.value)}/>
                        </FormGroup>
                        <FormGroup className="mb-3">
                            <Form.Control type="text" placeholder="Building" value={building}
                                          onChange={e => setBuilding(e.target.value)}/>
                        </FormGroup>
                        <FormGroup className="mb-3">
                            <Form.Control type="text" placeholder="Floor" value={floor}
                                          onChange={e => setFloor(e.target.value)}/>
                        </FormGroup>

                        {/*<h6>add Beamer</h6>*/}
                        {/*<BeamerField room={roomNr}/>*/}


                    </Form>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>Close</Button>
                <Button
                    type="submit"
                    className="submit-button ms-3"
                    onClick={e => uploadRoom(e,roomNr,floor,building)}
                >{uploadRoomState.loading ? "Loading..." :"Upload"}</Button>
            </Modal.Footer>
        </Modal>
    )
}

const Container = styled.div`

`;
