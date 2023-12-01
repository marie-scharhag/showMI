import React, {useEffect, useState} from 'react'
import styled from "styled-components";
import {ButtonGroup, Col, FloatingLabel, Form, FormGroup, FormLabel, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useLocation, useNavigate} from "react-router-dom";
import {useAsyncFn} from "react-use";
import {client} from "../App";
import {useAuth} from "../auth/AuthProvider";
import {
    Lecture,
    RoomMultiselectOption,
    Room,
    UserMultiselectOption,
    UserObject,
    Weekdays,
    LectureTypes, Information
} from "../Objects";
import Multiselect from "multiselect-react-dropdown";
import {deleteLecture, getImageForLecture, putLecture} from "../services/LectureService";
import {RoomMultiselect} from "./Fields/RoomMultiSelect";
import {UserMultiselect} from "./Fields/UsersMultiSelect";
import {InfoField} from "./Fields/InfoField";
import {InfoModal} from "./Modale/InfoModal";

export function LectureView() {
    const {state} = useLocation();
    const navigate = useNavigate()
    const {authTokens} = useAuth()
    const lecture: Lecture = state && state.lecture;
    const room: Room = state && state.room || null
    const [rooms, setRooms] = useState<Room[]>(lecture.room || []);
    const [lectureNr, setLectureNr] = useState(lecture.lectureNr)
    const [lectureName, setLectureName] = useState(lecture.lectureName)
    const [semester, setSemester] = useState(lecture.semester)
    const [typ, setTyp] = useState(lecture.typ)
    const [group, setGroup] = useState(lecture.group)
    const [weekday, setWeekday] = useState<Weekdays>(lecture.weekday)
    const [startTime, setStartTime] = useState(lecture.start)
    const [endTime, setEndTime] = useState(lecture.end)
    const [teachers, setTeachers] = useState<UserObject[]>(lecture.teacher)
    const [infos, setInfos] = useState<Information[]>(lecture.information)
    const [showModal, setShowModal] = useState(false);


    useEffect(() => {
        getImage()
    }, [])

    const handleGoBack = () => {
        navigate(-1);
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const [imageState, getImage] = useAsyncFn(async () => {
        if (!authTokens) return
        return await getImageForLecture(lecture, room, authTokens)
    })

    const [saveLectureState, saveLecture] = useAsyncFn(async (e,teachers,rooms,lectureNr,lectureName,semester,typ,group,weekday,startTime,endTime,infos) => {
        e.preventDefault()
        if (!authTokens) return
        console.log(teachers)
        const lectureObject: Lecture = {
            lectureNr: lectureNr,
            lectureName: lectureName,
            semester: semester,
            typ: typ,
            group: group,
            information: infos,
            room: rooms,
            teacher: teachers,
            study: lecture.study,
            id: lecture.id,
            weekday: weekday,
            start: startTime,
            end: endTime,
            semester_timetable: lecture.semester_timetable,
        };

        try{
            await putLecture(lecture.id, lectureObject ,authTokens)
            //TODO Toast Sucess
        }catch (e) {
            //TODO Toast error
        }


    })

    const [deleteLectureState, delLecture] = useAsyncFn(async (e) => {
        e.preventDefault()
        if (!authTokens) return
        try{
            await deleteLecture(lecture.id, authTokens)
            navigate(-1)
            //TODO Toast Delete Sucess
        }catch (e) {
            //TODO Toast Delete error
        }


    })


    return (
        <Container>
            <Row className="mx-3">
                <Col className="left" lg="8">
                    <div className="image-container">
                        {imageState.loading && <div>loading...</div>}
                        {imageState.error && <div>error while loading</div>}
                        {imageState.value &&
                            <img className="image" src={`data:;base64,${imageState.value}`} alt={"Image"}/>}
                    </div>
                </Col>
                <Col lg="4">
                    <Sidebar className="px-3">
                        <h3 className="header py-3">Veranstaltungs Ansicht</h3>
                        <Form>
                            <FormGroup className="mb-3">
                                <Form.Control
                                    type="number"
                                    placeholder="Vorlesungsnummer"
                                    value={lectureNr}
                                    onChange={(e) => setLectureNr(parseInt(e.target.value))}
                                />
                            </FormGroup>
                            <FormGroup className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Vorlesung XY"
                                    value={lectureName}
                                    onChange={(e) => setLectureName(e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup className="date-time-picker mb-3">
                                <Form.Control
                                    type="number"
                                    placeholder="Semester"
                                    value={semester}
                                    onChange={(e) => setSemester(parseInt(e.target.value))}
                                />
                                <Form.Select value={typ} onChange={(e) => setTyp(e.target.value as LectureTypes)}>
                                    {Object.values(LectureTypes).map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Control
                                    type="text"
                                    placeholder="Group"
                                    value={group}
                                    onChange={(e) => setGroup(e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup className="mb-3">
                                <UserMultiselect teachers={teachers} setTeachers={setTeachers}/>
                            </FormGroup>
                            <FormGroup className="mb-3 date-time-picker">
                                <Form.Select value={weekday} onChange={(e) => setWeekday(e.target.value as Weekdays)}>
                                    {Object.values(Weekdays).map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Control
                                    className="mx-1"
                                    type="time"
                                    placeholder="09:45"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                                <Form.Control
                                    type="time"
                                    placeholder="11:15"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup className="mb-3">
                                <RoomMultiselect rooms={rooms} setRooms={setRooms}/>
                            </FormGroup>
                            <FormGroup className="mb-3">
                                {infos.length > 0 &&
                                    infos.map(info => (<InfoField lecture={lecture} info={info}/>))
                                }
                                <Button onClick={openModal}>Add Info</Button>
                                <InfoModal lectures={[lecture]} showModal={showModal} closeModal={closeModal}/>
                            </FormGroup>
                            <div className="buttons">
                                <Button variant="secondary" onClick={handleGoBack}>Zurück</Button>
                                <Button variant="danger" onClick={delLecture}>{deleteLectureState.loading ? "Loading...":"Löschen"}</Button>
                                <Button type="submit" className="submit-button" onClick={(e) => saveLecture(e,teachers,rooms,lectureNr,lectureName,semester,typ,group,weekday,startTime,endTime,infos)}>Speichern</Button>
                            </div>
                        </Form>
                    </Sidebar>
                </Col>
            </Row>
        </Container>

    )
}

const Container = styled.div`

  .left {
    align-items: center;
    display: flex;
  }

  .image-container {
    //height: 450px;
    width: 800px;
    background: #FBFDFD;
    overflow: hidden;
  }

  .image {
    width: 100%;
    height: auto;
    display: block;
  }
`;

const Sidebar = styled.div`
  background: #FBFDFD;
  box-shadow: 0px 3px 20px #E0E0E0;
  border-radius: 10px;
  height: calc(100vh - 180px);

  .header {
    text-align: center;
  }

  .buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 65%;
  }

  .submit-button {
    background: #9BC328 !important;
    border-color: #9BC328 !important;
  }

  .date-time-picker {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;