import React, {useState} from 'react';
import {Modal, Button, Form} from 'react-bootstrap';
import axios from 'axios';
import {UserObject} from "../../Objects";
import {useAuth} from "../../auth/AuthProvider";
import {changePW} from "../../services/UserService";


interface Props {
    user: UserObject;
    showModal: boolean;
    closeModal: () => void;
}

const ChangePasswordModal = ({showModal, closeModal, user}: Props) => {
    const {authTokens} = useAuth();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleChangePassword = async () => {
        if (!authTokens) return
        try {
            await changePW(user, authTokens, oldPassword, newPassword);
            closeModal();
        } catch (error) {
            //TODO: Toast Error
            console.error('Error on PW change:', error);
        }
    };

    return (
        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Passwort ändern</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="my-3">
                        {/*<Form.Label>Altes Passwort</Form.Label>*/}
                        <Form.Control
                            type="password"
                            placeholder="Altes Passwort"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="my-3">
                        {/*<Form.Label>Neues Passwort</Form.Label>*/}
                        <Form.Control
                            type="password"
                            placeholder="Neues Passwort"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    Abbrechen
                </Button>
                <Button variant="primary" onClick={handleChangePassword}>
                    Passwort ändern
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ChangePasswordModal;