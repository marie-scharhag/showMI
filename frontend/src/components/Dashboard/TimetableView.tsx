import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react'
import styled from "styled-components";
import {Form, Stack} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {client} from "../../App";
import {useAuth} from "../../auth/AuthProvider";
import {TimetableModal} from "../Modale/TimetableModal";
import {useAsyncFn} from "react-use";
import {getAllTimetables} from "../../services/TimetableService";
import {TimetableItem} from "../Items/TimetableItem";
import {SemesterTimetable} from "../../Objects";

export function TimetableView() {
    const {authTokens} = useAuth();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        getTimetables()
    }, []);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const [timetableState, getTimetables] = useAsyncFn(async () => {
        if (!authTokens) return

        const response = await getAllTimetables(authTokens)
        const timetables: SemesterTimetable[] = response.data
        return timetables

    })


    return (
        <Container>
            <div className="py-4">
                <h3 className="head pb-3">Stundenplan</h3>
                <Button onClick={openModal}>Upload new Timetable</Button>
                <TimetableModal showModal={showModal} closeModal={closeModal}/>
                {timetableState.loading && <div>loading...</div>}
                {timetableState.error && <div>Error while loading</div>}
                {timetableState.value && timetableState.value.map(timetable => (
                    <TimetableItem key={timetable.semester_name} timetable={timetable}/>))}
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

  .sub-head {
    display: flex;
  }

  .submit-button {
    background: #9BC328 !important;
    border-color: #9BC328 !important;
  }
`;