import {UserObject} from "../../Objects";
import React, {FormEvent, useState} from "react";
import {Form, FormGroup, Modal} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import styled from "styled-components";
import {useAsyncFn} from "react-use";
import {useAuth} from "../../auth/AuthProvider";
import {editUser, registerUser} from "../../services/UserService";
import {ToastComponent} from "../ToastComponent";
import {Variant} from "react-bootstrap/types";

interface Props {
    user?: UserObject;
    showModal: boolean;
    closeModal: () => void;
    showToastHandler: (content: string, variant: Variant) => void;
}

export function UserModal({user, showModal, closeModal, showToastHandler}: Props) {
    const {authTokens} = useAuth()
    const [firstName, setFirstName] = useState(user?.first_name ||"")
    const [lastName, setLastName] = useState(user?.last_name||"")
    const [email, setEmail] = useState(user?.email||"")
    const [isStaff, setIsStaff] = useState(user?.is_staff||false)



    const [uploadUserState, uploadUser] = useAsyncFn(async (e,firstName:string,lastName:string,email:string,isStaff:boolean, user:UserObject|undefined) =>{
        e.preventDefault()
        if(!authTokens) return
        if(user){
            const userObject:UserObject = user
            userObject.first_name = firstName
            userObject.last_name = lastName
            userObject.email = email
            userObject.is_staff = isStaff
            try {
                await editUser(user,authTokens)
                closeModal()
                showToastHandler('User edited successfully', "success");
            }catch (e) {
                console.log("ERROR",e)
                showToastHandler('User added successfully', "danger");
            }

        }else{
            // if(!showToastHandler)return
            const formData = new FormData()
            formData.append("first_name",firstName)
            formData.append("last_name",lastName)
            formData.append("email",email)
            formData.append("is_staff",isStaff.toString().charAt(0).toUpperCase() + isStaff.toString().slice(1))
            try {
                await registerUser(formData,authTokens)
                closeModal()
                showToastHandler('User added successfully', "success");
            }catch (e) {
                console.log("ERROR",e)
                showToastHandler('User already exists', "danger");
            }
        }
    })
    return (
        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
                {user ?  (<Modal.Title>{firstName} {lastName}</Modal.Title>) : <Modal.Title>New User</Modal.Title>}
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Form>
                        <FormGroup>
                            <Form.Control type="text"
                                          placeholder="First Name"
                                          value={firstName}
                                          onChange={e => setFirstName(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup className="my-3">
                            <Form.Control type="text"
                                          placeholder="Last Name"
                                          value={lastName}
                                          onChange={e => setLastName(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup className="my-3">
                            <Form.Control type="email"
                                          placeholder="Email"
                                          value={email}
                                          onChange={e => setEmail(e.target.value)}
                            />
                        </FormGroup>
                        <Form.Group className="mb-3" >
                            <Form.Check type="checkbox" label="Admin premission" checked={isStaff}
                                        onChange={e => setIsStaff(e.target.checked)}/>
                        </Form.Group>
                    </Form>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>Close</Button>
                <Button onClick={e => uploadUser(e,firstName,lastName,email,isStaff,user)} type="submit" className="submit-button ms-3">Upload</Button>
            </Modal.Footer>
        </Modal>
    )
}

const Container = styled.div`

`;