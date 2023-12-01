import React, {useEffect, useRef, useState} from 'react'
import styled from "styled-components";
import {Col, Form, FormCheck, InputGroup, Row} from "react-bootstrap";
import Fullcalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import {useLocation, useNavigate} from "react-router-dom";
import {Event, getWeekdayNumber, Lecture, Room, UserObject} from "../Objects";
import {getLecturesForTeacher, getLecturesInRoom} from "../services/LectureService";
import {useAuth} from "../auth/AuthProvider";
import {EventClickArg} from "@fullcalendar/core";
import Button from "react-bootstrap/Button";
import {InfoModal} from "./Modale/InfoModal";
import {useAsyncFn} from "react-use";


//TODO documents auch anzeigen
export function TeacherView() {
    const [calendarKey, setCalendarKey] = useState(0);
    const navigate = useNavigate()
    const {state} = useLocation();
    const user: UserObject = state && state.user;
    const {authTokens} = useAuth();
    const [lectureEventsState, setLectureEvents] = useState<Event[]>([])
    const [selectedLectures, setSelectedLectures] = useState<Lecture[]>([])
    const [selectState, setSelectState] = useState(false)
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        getLectures()
    }, [])

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const [lecturesState, getLectures] = useAsyncFn(async () => {
        if (!authTokens) return
        try {
            const response = await getLecturesForTeacher(user, authTokens)
            const lectures: Array<Lecture> = response.data
            setLectureEvents([])
            generateLectureEvents(lectures)
            return lectures
        } catch (e) {
            //TODO Toast Error
        }

    })


    const generateWeekdayEvents = (lecture: Lecture, numWeeks: number, weekday: number) => {
        const events: Array<Event> = [];
        let currentDate = new Date();

        for (let i = 0; i < numWeeks; i++) {
            // Find the next occurrence of the specified weekday
            while (currentDate.getDay() !== weekday) {
                currentDate.setDate(currentDate.getDate() + 1);
            }

            events.push({
                title: lecture.lectureName,
                start: currentDate.toISOString().split('T')[0] + ' ' + lecture.start,
                end: currentDate.toISOString().split('T')[0] + ' ' + lecture.end,
                content: lecture,
                color: "#9BC328",
            });

            currentDate.setDate(currentDate.getDate() + 7); // Move to the next week
        }
        return events;
    };

    function generateLectureEvents(lectures: Lecture[]) {
        const numWeeks = 10;
        lectures.map(lecture => {
            // const timeslot = lecture.timeslot[0];
            if (lecture.weekday && lecture.start && lecture.end) {
                const events = generateWeekdayEvents(lecture, numWeeks, getWeekdayNumber(lecture.weekday));
                setLectureEvents((prev) => [...prev, ...events])
            }
        })
    }

    function selectLectures(e: EventClickArg){
        if (!e.event.start || !e.event.end) return
        const index = lectureEventsState.findIndex(lecture => lecture.content == e.event.extendedProps.content)
            const newEventList = lectureEventsState

            setSelectedLectures(prev => {
                const lectureInList = prev.some(lecture => lecture == e.event.extendedProps.content)
                if (lectureInList) {
                    return prev.filter(lecture => lecture !== e.event.extendedProps.content)
                } else {
                    return [...prev, e.event.extendedProps.content]
                }
            })

            const eventData: Event = {
                title: e.event.title,
                start: e.event.start.toISOString(),
                end: e.event.end.toISOString(),
                content: e.event.extendedProps.content,
                color: newEventList[index].color == "#9BC328" ? "#009682" : "#9BC328",
            };
            newEventList[index] = eventData

            setLectureEvents(newEventList)
            setCalendarKey(prevKey => prevKey + 1);
            console.log("Event", lectureEventsState[index]);
    }

    function handleEvent(e: EventClickArg) {

        if (selectState) {
            selectLectures(e)
        }else{
            navigate(`/lecture/${e.event.extendedProps.content.id}`, {state: {lecture: e.event.extendedProps.content}})
        }

        // if (eventData.content.lectureNr) {
        //     navigate(`/lecture/${eventData.content.id}`, {state: {lecture: eventData.content, room: room}})
        // } else {
        //     navigate(`/document/${eventData.content.id}`, {state: {document: eventData.content, room: room}})
        // }
    }

    return (
        <Container>
            <RoomDiv className="mx-3 mb-3">
                <Row className="room-row">
                    <Col xs="4">
                        <div className="room-id mt-2"><h3
                            className="ps-3 py-2">{user.first_name + ", " + user.last_name}</h3></div>
                    </Col>
                    {/*<Col xs="3">*/}
                    {/*    <Form.Control className="input-field" type="text" placeholder="Gebäude" value={user.last_name}/>*/}
                    {/*</Col>*/}
                    <Col xs="3">
                        <Form.Control className="input-field" type="text" placeholder="Stockwerk" value={user.email}/>
                    </Col>
                    <Col xs="3">
                        <Form.Control className="input-field" type="text" placeholder="Password"/>
                    </Col>
                </Row>
            </RoomDiv>
            <Calendar className="mx-3 p-3">
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Select Lectures" checked={selectState}
                                onChange={e => setSelectState(e.target.checked)}/>
                    <Button onClick={openModal}>Create Info</Button>
                </Form.Group>
                <InfoModal lectures={selectedLectures} showModal={showModal} closeModal={closeModal}/>
                <Fullcalendar
                    key={calendarKey}
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
                    events={lectureEventsState}
                    eventClick={e => handleEvent(e)}
                    selectable={true}

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