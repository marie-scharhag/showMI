import React, {FormEvent, useState} from 'react'
import styled from 'styled-components'
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../auth/AuthProvider";
import {DropdownDivider, FloatingLabel} from "react-bootstrap";


export function LoginView(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    async function submitLogin(e: FormEvent) {
        try{
            login(email,password);
            navigate("/")
        } catch (e) {
            console.log(e)
        }
    }

    return(
        <Container>
            <div className="form-container">
                <h1 className="mt-5 mb-4">Login</h1>
                <Form className="mx-5" onSubmit={e => submitLogin(e)}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <FloatingLabel controlId="floatingMailGrid" label="Email address">
                            <Form.Control type="email" placeholder="name@hs-rm.de" value={email} onChange={e => setEmail(e.target.value)} />
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <FloatingLabel controlId="floatingPasswordGrid" label="Password">
                            <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                        </FloatingLabel>
                    </Form.Group>
                    <Button className="submit-button" type="submit">
                        Login
                    </Button>
                </Form>
                <hr className="mx-5 mt-4"/>
                <div>Noch kein Account?</div>
                <a href="" className="link" >Wende dich an deinen System Admin</a>
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
        height: 55vh; 
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