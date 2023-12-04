import React, {FormEvent, useState} from "react";
import {Information, Lecture, LectureTypes, Room, UserObject, Weekdays} from "../../Objects";
import {Form, FormGroup, Modal} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import styled from "styled-components";
import {UserMultiselect} from "../Fields/UsersMultiSelect";
import {RoomMultiselect} from "../Fields/RoomMultiSelect";
import {InfoField} from "../Fields/InfoField";
import {InfoModal} from "./InfoModal";
import {postLecture, putLecture} from "../../services/LectureService";
import {useAuth} from "../../auth/AuthProvider";
import {useAsyncFn} from "react-use";
import {Variant} from "react-bootstrap/types";

interface Props {
    room: Room;
    showModal: boolean;
    closeModal: () => void;
    showToastHandler: (content: string, variant: Variant) => void;
}

export function LectureModal({room, showModal, closeModal, showToastHandler}: Props) {
    const {authTokens} = useAuth()
    const [rooms, setRooms] = useState<Room[]>([room]);
    const [lectureNr, setLectureNr] = useState(0)
    const [lectureName, setLectureName] = useState("")
    const [semester, setSemester] = useState(0)
    const [typ, setTyp] = useState(LectureTypes.Vorlesung)
    const [group, setGroup] = useState("")
    const [weekday, setWeekday] = useState<Weekdays>(Weekdays.MO)
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const [teachers, setTeachers] = useState<UserObject[]>([])


    const [saveLectureState, saveLecture] = useAsyncFn(async (e,teachers:UserObject[],rooms:Room[],lectureNr:number,lectureName:string,semester:number,typ:LectureTypes,group:string,weekday:Weekdays,startTime:string,endTime:string) => {
        e.preventDefault()
        if(!authTokens) return
        const formData = new FormData()
        formData.append("lectureNr", lectureNr.toString())
        formData.append("lectureName", lectureName)
        formData.append("semester", semester.toString())
        formData.append("typ", typ)
        formData.append("group", group)
        formData.append("weekday", weekday)
        formData.append("start", startTime)
        formData.append("end", endTime)
        rooms.forEach((room, index) => {
            formData.append(`rooms`, `${room.roomNr}`);
        });
        teachers.forEach((teacher, index) => {
            formData.append(`teacher`, `${teacher.id}`);
        });
        try{
            await postLecture(formData,authTokens)
            closeModal()
            showToastHandler("Lecture upload successfully", "success")
        }catch (e) {
            showToastHandler("Error at Lecture upload", "danger")
        }


    })


    return (
        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Neue Lehrveranstaltung</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
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
                            <Form.Select className="mx-1" value={typ}
                                         onChange={(e) => setTyp(e.target.value as LectureTypes)}>
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
                        <FormGroup>
                            <Form.Select>
                                {/*TODO select semester timetable -> SemesterTimetable umbenennen?*/}
                            </Form.Select>
                        </FormGroup>
                    </Form>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>Close</Button>
                <Button
                    onClick={e => saveLecture(e,teachers,rooms,lectureNr,lectureName,semester,typ,group,weekday,startTime,endTime)}
                    type="submit"
                    className="submit-button ms-3"
                >{saveLectureState.loading ? "Loading..." : "Upload"}</Button>
            </Modal.Footer>
        </Modal>)
}

const Container = styled.div`
  .date-time-picker {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

