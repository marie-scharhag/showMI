import React, {useEffect, useState} from 'react'
import styled from "styled-components";
import {Badge, Dropdown} from "react-bootstrap";
import {client} from "../../App";
import {useAuth} from "../../auth/AuthProvider";
import {UserObject} from "../../Objects";
import {useNavigate} from "react-router-dom";
import {UserModal} from "../Modale/UserModal";
import {Variant} from "react-bootstrap/types";

interface Props {
    user: UserObject
    showToastHandler: (content: string, variant: Variant) => void;
}

export function UserItem({user,showToastHandler}: Props) {
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <Container className="mx-3">
            <div className="left"
                 onClick={() => navigate(`/teacher/${user.first_name}_${user.last_name}`, {state: {user: user}})}>
                <i className="bi bi-person-circle user-icon ms-3"></i>
                <div className="my-2 ms-3 name-mail-group">
                    <div className="name">{user.first_name}, {user.last_name} </div>
                    <div className="mail">{user.email}</div>
                </div>
            </div>
            <div className="right">
                <div>{user.is_staff ?
                    (<Badge className="badge">Admin</Badge>) :
                    (<Badge className="badge">User</Badge>)}
                </div>
                <Dropdown>
                    <Dropdown.Toggle as={CustomToggle}/>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={openModal}>Bearbeiten</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">Löschen</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <UserModal user={user} showModal={showModal} closeModal={closeModal} showToastHandler={showToastHandler}/>

            </div>
        </Container>

    )
}

const CustomToggle = React.forwardRef(({ onClick }: any, ref: any) => (
  <i
    className="bi bi-three-dots-vertical me-2 ms-3"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  />
));

const Container = styled.div`
  background: white;
  box-shadow: 0px 3px 20px #F2F2F2;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;


  .left {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 70%;
  }

  .right {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .user-icon {
    font-size: 1.5rem;
    color: #9BC328
  }

  .name-mail-group {
    max-width: 75%;
  }

  .name {
    font-size: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mail {
    font-size: 0.8rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .badge {
    background-color: #E6EDED !important;
    color: #9BC328 !important;
  }
`;
