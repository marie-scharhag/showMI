import React, {useState} from 'react'
import styled from "styled-components";
import {useAuth} from "../../auth/AuthProvider";
import {Link, useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
import ChangePasswordModal from "../Modale/ChangePasswordModal";
import {Dropdown} from "react-bootstrap";
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
            </div>
            <div className="me-5 icon">
                <Dropdown>
                    <Dropdown.Toggle as={CustomToggle}/>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={openModal}>Passwort ändern</Dropdown.Item>
                        <Dropdown.Item onClick={logout}>Ausloggen</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <ChangePasswordModal user={user} showModal={showModal} closeModal={closeModal}/>
            </div>
        </Container>
    )
}



export const CustomToggle = React.forwardRef(({ onClick }: any, ref: any) => (
  <i
    className="bi bi-person-circle me-2 ms-3"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  />
));

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