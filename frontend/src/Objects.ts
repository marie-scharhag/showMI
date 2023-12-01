export interface UserObject{
    id: number;
    email: string;
    is_staff: boolean;
    first_name: string;
    last_name: string;
}

export interface JWTToken{
    access: string;
    refresh: string;
}

export interface AuthContextType {
    user: UserObject;
    authTokens: JWTToken | null;
    login: (email:string, password:string) => void;
    logout: () => void;
}

export interface Room{
    roomNr: string;
    floor?: string;
    building?: string;
}

export interface RoomMultiselectOption {
  name: string;
  id: string;
}

export interface UserMultiselectOption {
  name: string;
  id: number;
}

export enum Weekdays{
    SO = "SO",
    MO = "MO",
    DI = "DI",
    MI = "MI",
    DO = "DO",
    FR = "FR",
    SA = "SA",
}

export function getWeekdayNumber(day: Weekdays): number {
    switch (day) {
        case Weekdays.SO:
            return 0;
        case Weekdays.MO:
            return 1;
        case Weekdays.DI:
            return 2;
        case Weekdays.MI:
            return 3;
        case Weekdays.DO:
            return 4;
        case Weekdays.FR:
            return 5;
        case Weekdays.SA:
            return 6;
    }
}

// export interface Timeslot{
//     weekday: Weekdays;
//     start: Date;
//     end: Date;
// }

export interface Information{
    info: string;
    start: string;
    end: string;
}

export interface Study{
    studyName: string;
    id: number;
}

export enum LectureTypes{
    Vorlesung = "V",
    Praktikum = "P",
    Übung = "Ü",
    Seminar = "S",
}

export interface Lecture{
    lectureNr: number;
    lectureName: string;
    semester: number;
    typ: LectureTypes;
    group: string;
    information: Array<Information>;
    // timeslot: Array<Timeslot>;
    room: Array<Room>;
    teacher: Array<UserObject>;
    study: Study;
    id: number;
    weekday: Weekdays;
    start: string;
    end: string;
    semester_timetable: SemesterTimetable;
}
export interface Event{
    title: string;
    start: string;
    end: string;
    content: Lecture | Document;
    color: string;
}

export interface Document{
    id: number;
    documentData: string;
    name: string;
    start: string;
    end: string;
    rooms: Array<Room>;
    onlyDisplay: boolean;
}

export interface SemesterTimetable{
    semester_name: string;
    timetable_data: string;
    semester_start: Date;
    semester_end: Date;
}

export interface Beamer{
    name: string;
    ip_address: string;
    port: string;
    room: Room;
}