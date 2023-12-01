import React, {useState} from 'react'
import styled from "styled-components";
import {useAuth} from "../../auth/AuthProvider";
import {Link, useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
import ChangePasswordModal from "../Modale/ChangePasswordModal";

export function NavbarView(){

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return(
        <Container className="mt-2">
            <div className="left-side ms-5">
                <div className="system-name" onClick={()=>user.is_staff ? navigate("/admin") : navigate(`/teacher/${user.first_name}_${user.last_name}`,{state:{user:user}})}>showMI</div>
                {/*<div className="semester-div ms-3">*/}
                {/*    <div className="semester">Wintersemester 23/24</div>*/}
                {/*    <div className="semester-date">01.10.2023 - 01.03.24</div>*/}
                {/*</div>*/}
            </div>
            <div className="me-5 icon">
                <Button onClick={openModal}>Change PW</Button>
                <i className="bi bi-person-circle" onClick={logout}></i>
                <ChangePasswordModal user={user} showModal={showModal} closeModal={closeModal}/>
            </div>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    justify-content: space-between;

    .left-side{
        display: flex;
        justify-content: center;
        align-items: center;
       
    }
    .system-name{
        font-size: 2.5rem;
        color: #9BC328;
    }
    .semester{
        font-size: 1rem;
    }
    .semester-date{
        font-size: 0.8rem;
    }
    
    .icon{
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2rem;
        color: #9BC328;
    }
`;