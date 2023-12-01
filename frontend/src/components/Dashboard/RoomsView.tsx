import React, {useEffect, useState} from 'react'
import styled from "styled-components";
import {Col, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../auth/AuthProvider";
import {useAsyncFn} from "react-use";
import {client} from "../../App";
import {Room} from "../../Objects"
import {RoomList} from "../Items/RoomList";
import {getAllRooms, getRoomsInStudy} from "../../services/RoomService";
import Button from "react-bootstrap/Button";
import {RoomModal} from "../Modale/RoomModal";

// interface Room{
//     roomNr: string;
//     floor: string;
//     building: string;
//     beamer: string;
// }

export function RoomsView() {
    const {authTokens} = useAuth()
    const [showModal, setShowModal] = useState(false);


    useEffect(() => {
        getRooms()
    }, [])

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const [roomsState, getRooms] = useAsyncFn(async () => {
        if (!authTokens) return
        const response = await getAllRooms(authTokens)
        const rooms: Array<Room> = response.data
        return rooms
    })


    return (
        <Container>
            <Button onClick={openModal}>New Room</Button>
            <RoomModal showModal={showModal} closeModal={closeModal}/>
            <div className="py-4">
                <h3 className="head pb-3">Rooms</h3>

                {roomsState.loading && <div>Loading...</div>}
                {roomsState.error && <div>Error loading rooms</div>}
                {roomsState.value && (
                    <RoomList rooms={roomsState.value} />
                )}

            </div>
        </Container>

    )
}

const Container = styled.div`
  background-color: #FBFDFD;
  box-shadow: 0px 3px 20px #E0E0E0;
  border-radius: 10px;

  .head {
    text-align: center;
  }
`;
