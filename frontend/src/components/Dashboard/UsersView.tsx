import React, {useEffect, useState} from 'react'
import styled from "styled-components";
import {Row, Stack} from "react-bootstrap";
import {UserItem} from "../Items/UserItem";
import {useAsyncFn} from "react-use";
import {client} from "../../App";
import {useAuth} from "../../auth/AuthProvider";
import {UserObject} from "../../Objects";
import {UserModal} from "../Modale/UserModal";
import Button from "react-bootstrap/Button";
import {getAllUsers} from "../../services/UserService";
import {Variant} from "react-bootstrap/types";

interface Props {
    showToastHandler: (content: string, variant: Variant) => void;
}

export function UsersView({showToastHandler}: Props) {
    const {authTokens} = useAuth()
    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        getUsers()
    }, [])

    const [usersState, getUsers] = useAsyncFn(async () => {
        if (!authTokens) return
        const response = await getAllUsers(authTokens)
        const users: Array<UserObject> = response.data
        return users
    })

    return (
        <Container>

            <UserModal showModal={showModal} closeModal={closeModal} showToastHandler={showToastHandler}/>
            <div className="icon col-auto ms-3">
                <i onClick={openModal} className="bi bi-plus-square-fill"></i>
            </div>
            <div className="py-4">
                <h3 className="head pb-3 col center md-3">Users</h3>

                {usersState.loading && <div>Loading...</div>}
                {usersState.error && <div>No Users found</div>}
                {usersState.value && (
                    <Stack className="stack" gap={2}>
                        {usersState.value.map(user => (
                            <UserItem key={user.email} user={user} showToastHandler={showToastHandler}></UserItem>
                        ))}
                    </Stack>
                )}
            </div>
        </Container>
    )
}

const Container = styled.div`
  background-color: #FBFDFD;
  box-shadow: 0px 3px 20px #E0E0E0;
  border-radius: 10px;
  //overflow: scroll;

  .head {
    text-align: center;
  }

  .stack {
    max-height: calc(100vh - 320px);
    overflow: scroll;
  }

  .icon {
    display: flex;

    font-size: 2rem;
    color: #9BC328;
  }
`;