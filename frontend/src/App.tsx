import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AdminView} from "./components/Dashboard/AdminView"
import {LoginView} from "./components/LoginView";
import {RegisterView} from "./components/RegisterView";
import axios from "axios";
import {Dashboard} from "./components/Dashboard/Dashboard";
import PrivateRoute from "./auth/PrivateRoute";
import {AuthProvider} from "./auth/AuthProvider";
import {RoomView} from "./components/RoomView";
import {LectureView} from "./components/LectureView";
import {TeacherView} from "./components/TeacherView";
import {DocumentView} from "./components/DocumentView";


export const client = axios.create({
    baseURL: "http://localhost:8000"
});


function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<PrivateRoute><Dashboard/></PrivateRoute>}>
                        <Route path="admin/" element={<AdminView/>}/>
                        <Route path=":roomNr" element={<RoomView/>}/>
                        <Route path="lecture/:lectureId" element={<LectureView/>}/>
                        <Route path="document/:id" element={<DocumentView/>}/>
                        <Route path="teacher/:name" element={<TeacherView/>}/>
                    </Route>
                    <Route path="/login" element={<LoginView/>}/>
                    <Route path="/register" element={<RegisterView/>}/>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App;
