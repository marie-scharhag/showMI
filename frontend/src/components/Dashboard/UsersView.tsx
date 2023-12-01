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

export function UsersView() {
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
            <Button onClick={openModal}>New User</Button>
            <UserModal showModal={showModal} closeModal={closeModal}/>
            <div className="py-4">
                <h3 className="head pb-3">Users</h3>
                {usersState.loading && <div>Loading...</div>}
                {usersState.error && <div>No Users found</div>}
                {usersState.value && (
                    <Stack className="stack" gap={2}>
                        {usersState.value.map(user => (
                            <UserItem key={user.email} user={user}></UserItem>
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
    max-height: calc(100vh - 280px);
    overflow: scroll;
  }
`;