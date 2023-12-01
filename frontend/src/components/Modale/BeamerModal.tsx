import {Room} from "../../Objects";
import {useAuth} from "../../auth/AuthProvider";
import {Form, FormGroup, FormLabel, Modal} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import React, {FormEvent, useState} from "react";
import styled from "styled-components";
import {client} from "../../App";

interface Props {
    room: Room;
    showModal: boolean;
    closeModal: () => void;
}

export function BeamerModal({room, showModal, closeModal}: Props) {
    const {authTokens} = useAuth();
    const [name, setName] = useState("")
    const [ipAddress, setIpAddress] = useState("")
    const [port, setPort] = useState("")

    const handleUpload = (e: FormEvent) => {
        e.preventDefault()

    };
    return (
        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Beamer in {room.roomNr}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Form onSubmit={e => handleUpload(e)}>
                        <FormGroup>
                            <Form.Control type="text"
                                          placeholder="Beamer Name"
                                          value={name}
                                          onChange={e => setName(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup className="my-3">
                            <Form.Control type="text"
                                          placeholder="IP Address"
                                          value={ipAddress}
                                          onChange={e => setIpAddress(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup className="my-3">
                            <Form.Control type="text"
                                          placeholder="Port"
                                          value={port}
                                          onChange={e => setPort(e.target.value)}
                            />
                        </FormGroup>
                    </Form>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>Close</Button>
                <Button onClick={handleUpload} type="submit" className="submit-button ms-3">Upload</Button>
            </Modal.Footer>
        </Modal>
    )

}

const Container = styled.div`

`;