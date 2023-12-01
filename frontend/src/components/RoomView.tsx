import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react'
import styled from "styled-components";
import {Col, Form, Row} from "react-bootstrap";
import Fullcalendar from "@fullcalendar/react";
import timeGridPlugin from '@fullcalendar/timegrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import {client} from "../App";
import {useAuth} from "../auth/AuthProvider";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useAsyncFn} from "react-use";
import {getWeekdayNumber, Lecture, Weekdays, Event, Room, Document} from "../Objects";
import {EventClickArg} from "@fullcalendar/core";
import {getLecturesInRoom} from "../services/LectureService";
import {getDocumentsInRoom} from "../services/DocumentService";
import Button from "react-bootstrap/Button";
import {BeamerModal} from "./Modale/BeamerModal";
import {saveRoomChanges} from "../services/RoomService";
import {LectureModal} from "./Modale/LectureModal";

//TODO select hinzufügen
export function RoomView() {
    const navigate = useNavigate()
    const {authTokens} = useAuth()
    const {state} = useLocation();
    const room: Room = state && state.room;
    const [lectureEventsState, setLectureEvents] = useState<Event[]>([])
    const [documentEventsState, setDocumentEvents] = useState<Event[]>([])
    const [floor, setFloor] = useState(room.floor || "")
    const [building, setBuilding] = useState(room.building || "")
    const [showModal, setShowModal] = useState(false);
    const [showLectureModal, setShowLectureModal] = useState(false);

    useEffect(() => {
        getLectures()
        getDocuments()
    }, [])


    function hanndleRoomChange() {
        if (!authTokens) return
        const roomObjekt = room
        roomObjekt.floor = floor
        roomObjekt.building = building
        saveRoomChanges(roomObjekt, authTokens)
    }

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const openLectureModal = () => {
        setShowLectureModal(true);
    };

    const closeLectureModal = () => {
        setShowLectureModal(false);
    };


    const [lecturesState, getLectures] = useAsyncFn(async () => {
        if (!authTokens) return
        try {
            const response = await getLecturesInRoom(room, authTokens)
            const lectures: Array<Lecture> = response.data

            setLectureEvents([])
            generateLectureEvents(lectures)
            return lectures
        } catch (e) {
            //TODO Toast Error
        }

    })
    //TODO loading spinner if lecture or documents loading
    const [documentsState, getDocuments] = useAsyncFn(async () => {
        if (!authTokens) return
        try {
            const response = await getDocumentsInRoom(room, authTokens)
            const documents: Array<Document> = response.data

            setDocumentEvents([])
            generateDocumentEvents(documents)
            return documents
        } catch (e) {
            //TODO Error Toast
        }

    })

    const generateWeekdayEvents = (lecture: Lecture, startDate: Date, endDate: Date, weekday: number) => {
        const events: Array<Event> = [];
        let start = new Date(startDate);
        let end = new Date(endDate);
        console.log(startDate, endDate)

        while (start <= end) {
            // Find the next occurrence of the specified weekday
            while (start.getDay() !== weekday) {
                start.setDate(start.getDate() + 1);
            }

            events.push({
                title: lecture.lectureName,
                start: start.toISOString().split('T')[0] + ' ' + lecture.start,
                end: start.toISOString().split('T')[0] + ' ' + lecture.end,
                content: lecture,
                color: "#9BC328",
            });

            start.setDate(start.getDate() + 7); // Move to the next week
        }
        return events;
    };

    function generateDocumentEvents(documents: Document[]) {
        const events: Array<Event> = [];
        documents.map(document => {
            events.push({
                title: document.name,
                start: document.start,
                end: document.end,
                content: document,
                color: "#9BC328",
            })
        })
        console.log(events)
        setDocumentEvents(events)
    }

    function generateLectureEvents(lectures: Lecture[]) {
        const numWeeks = 10;
        lectures.map(lecture => {
            // const timeslot = lecture.timeslot[0];
            // if (lecture.weekday && lecture.start && lecture.end) {
            const events = generateWeekdayEvents(lecture, lecture.semester_timetable.semester_start, lecture.semester_timetable.semester_end, getWeekdayNumber(lecture.weekday));
            setLectureEvents((prev) => [...prev, ...events])
            // }
        })
    }

    function handleEvent(e: EventClickArg) {
        const eventData = {
            title: e.event.title,
            start: e.event.start,
            end: e.event.end,
            content: e.event.extendedProps.content,
        };
        console.log("Event", eventData.content.lectureNr);
        if (eventData.content.lectureNr) {
            navigate(`/lecture/${eventData.content.id}`, {state: {lecture: eventData.content, room: room}})
        } else {
            navigate(`/document/${eventData.content.id}`, {state: {document: eventData.content, room: room}})
        }
    }

    return (
        <Container>
            <RoomDiv className="mx-3 mb-3">
                <Row className="room-row">
                    <Col xs="2">
                        <div className="room-id mt-2"><h3 className="ps-3 py-2">{room.roomNr}</h3></div>
                    </Col>
                    <Col xs="3">
                        <Form.Control className="input-field" type="text" placeholder="Gebäude" value={building}
                                      onChange={(e) => setBuilding(e.target.value)}/>
                    </Col>
                    <Col xs="3">
                        <Form.Control className="input-field" type="text" placeholder="Stockwerk" value={floor}
                                      onChange={(e) => setFloor(e.target.value)}/>
                    </Col>
                    <Col><Button onClick={hanndleRoomChange}>Submit</Button></Col>
                    <Col xs="3">
                        <Button onClick={openModal}>Manage Beamer</Button>
                        <BeamerModal room={room} showModal={showModal} closeModal={closeModal}/>
                        {/*<Form.Control className="input-field" type="text" placeholder="Beamer" value={room.beamer}/>*/}
                    </Col>
                </Row>
            </RoomDiv>
            <Calendar className="mx-3 p-3">
                <Button onClick={openLectureModal}>Neue Lehrveranstaltung</Button>
                <LectureModal room={room} showModal={showLectureModal} closeModal={closeLectureModal}/>
                <Fullcalendar
                    plugins={[timeGridPlugin, bootstrap5Plugin]}
                    locale={"de"}
                    headerToolbar={{left: '', right: 'prev,today,next'}}
                    buttonText={{today: 'heute'}}
                    themeSystem={'bootstrap5'}
                    slotMinTime={"08:00"}
                    slotMaxTime={"19:00"}
                    slotLabelFormat={{hour: 'numeric', minute: 'numeric'}}
                    // slotDuration={"00:15"}
                    slotLabelInterval={"01:00"}
                    nowIndicator={true}
                    firstDay={1}
                    height={"100%"}
                    events={lectureEventsState.concat(documentEventsState)}
                    eventClick={e => handleEvent(e)}
                />
            </Calendar>

        </Container>

    )
}

const Container = styled.div``;

const Calendar = styled.div`
  background: #FBFDFD;
  box-shadow: 0px 3px 20px #E0E0E0;
  border-radius: 10px;
  height: calc(100vh - 260px);

  .fc-toolbar-chunk {
    margin-right: 8%;
    margin-top: -10%;
  }

  .btn-primary {
    background-color: #9BC328;
    border-color: #9BC328;

  }
`;

const RoomDiv = styled.div`
  background: #FBFDFD;
  box-shadow: 0px 3px 20px #E0E0E0;
  border-radius: 10px;
  width: 70%;

  .room-row {
    // width: 100%;
    align-items: center;

  }

  .room-form {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .input-field {
    display: flex;
    align-items: center;
    width: 100%;
    height: 30px;
  }
`;