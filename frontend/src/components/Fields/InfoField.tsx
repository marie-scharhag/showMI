import {Information, Lecture, Room} from "../../Objects";
import {Form, FormGroup, FormLabel} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {InfoModal} from "../Modale/InfoModal";

interface Props {
    info: Information;
    lecture:Lecture;
    // setInfos: React.Dispatch<React.SetStateAction<Information[]>>;
}

export function InfoField({info,lecture}: Props) {
    const [startDate, setStartDate] = useState(info.start.toString().split('T')[0])
    const [startTime, setStartTime] = useState(info.start.toString().split('T')[1].slice(0, 5))
    const [endDate, setEndDate] = useState(info.end.toString().split('T')[0])
    const [endTime, setEndTime] = useState(info.end.toString().split('T')[1].slice(0, 5))
    const [infoText, setInfoText] = useState(info.info)
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        console.log(startTime)
    }, []);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    //TODO: MOdal abfuck modla lässt sich nicht schließen
    return (
        <div className="mb-3" onClick={openModal}>
            <h6>Information</h6>
            <div>{info.info}</div>
            <InfoModal lectures={[lecture]} info={info} showModal={showModal} closeModal={closeModal}/>
            {/*<FormGroup className="my-3 date-time-picker">*/}
            {/*    <FormLabel label="End">Von</FormLabel>*/}
            {/*    <Form.Control className="" type="date" value={startDate?.toString()}*/}
            {/*                  onChange={(e) => setStartDate(e.target.value)}/>*/}
            {/*    <Form.Control className="" type="time" value={startTime?.toString()}*/}
            {/*                  onChange={(e) => setStartTime(e.target.value)}/>*/}
            {/*</FormGroup>*/}
            {/*<FormGroup className="my-3 date-time-picker">*/}
            {/*    <FormLabel label="End">Bis</FormLabel>*/}
            {/*    <Form.Control className="" type="date" value={endDate?.toString()}*/}
            {/*                  onChange={(e) => setEndDate(e.target.value)}/>*/}
            {/*    <Form.Control className="" type="time" value={endTime?.toString()}*/}
            {/*                  onChange={(e) => setEndTime(e.target.value)}/>*/}
            {/*</FormGroup>*/}
            {/*<Form.Control as="textarea" placeholder="Information" value={infoText}*/}
            {/*              onChange={(e) => setInfoText(e.target.value)}/>*/}
        </div>
    )

}

const Container = styled.div`

  .date-time-picker {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;