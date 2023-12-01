import React, {FormEvent, useState} from 'react'
import styled from 'styled-components'
import {FloatingLabel, Form, FormGroup} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {client} from "../App";
import {useAuth} from "../auth/AuthProvider";


export function RegisterView(){

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [study, setStudy] = useState('');
    const [prename, setPrename] = useState('');
    const [lastname, setLastname] = useState('');

    const { login } = useAuth();

    //TODO hinfällig löschen

    function submitRegistration(e:FormEvent) {
        e.preventDefault();
        client.post(
          "/api/register",
          {
            email: email,
            username: username,
            password: password
          }
        ).then(function(res) {
          try {
              login(email,password)
          } catch (e) {
              console.log(e)
          }
        });
    }

    return(
        <Container>
            <div className="form-container">
                <h1 className="mt-5 mb-4">Neues System</h1>
                <Form className="mx-5" onSubmit={e => submitRegistration(e)}>
                    <Form.Group className="mb-3" controlId="formBasicStudy">
                        <FloatingLabel controlId="studyLabel" label="Studiengang">
                            <Form.Control type="text" placeholder="Medieninformatik" value={study} onChange={e => setStudy(e.target.value)} />
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <FloatingLabel controlId="emailLabel" label="Email">
                            <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <FloatingLabel label="Vorname">
                            <Form.Control type="text" placeholder="Max" value={prename} onChange={e => setPrename(e.target.value)}/>
                        </FloatingLabel>
                    </Form.Group>
                    <FormGroup className="mb-3">
                        <FloatingLabel label="Nachname">
                            <Form.Control type="text" placeholder="Mustermann" value={lastname} onChange={e => setLastname(e.target.value)}/>
                        </FloatingLabel>
                    </FormGroup>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <FloatingLabel label="Password">
                            <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formControlPassword">
                        <FloatingLabel label="Control Password">
                            <Form.Control type="password" placeholder="Password" value={passwordCheck} onChange={e => setPasswordCheck(e.target.value)} />
                        </FloatingLabel>
                    </Form.Group>
                    <Button className="submit-button mb-5" type="submit">
                        System erstellen
                    </Button>
                </Form>
            </div>
        </Container>

    )
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    min-height: 100vh;

    .form-container{
        width: 50vh; 
        height: fit-content; 
        background: white; 
        box-shadow: 0px 1px 10px #828282; 
        border-radius: 5px;
    }
   
    .form{
        padding: 0px 10px 0px 10px;
    }
    
    .submit-button{
        width: 100%;
        background: #9BC328 !important; 
        border-color: #9BC328 !important;
    }
    
    .link{
        color: #9BC328
    }
`;