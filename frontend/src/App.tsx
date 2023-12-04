import React, {useState} from 'react';
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
import {Variant} from "react-bootstrap/types";
import {ToastComponent} from "./components/ToastComponent";


export const client = axios.create({
    baseURL: "http://localhost:8000"
});


function App() {
    const [showToast, setShowToast] = useState(false);
    const [toastContent, setToastContent] = useState('');
    const [toastVariant, setToastVariant] = useState<Variant>("");

    const showToastHandler = (content:string, variant:Variant) => {
        setToastContent(content);
        setToastVariant(variant);
        setShowToast(true);
    };

    const closeToastHandler = () => {
        setShowToast(false);
    };
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<PrivateRoute><Dashboard showToastHandler={showToastHandler}/></PrivateRoute>}>
                        <Route path="admin/" element={<AdminView showToastHandler={showToastHandler}/>}/>
                        <Route path=":roomNr" element={<RoomView showToastHandler={showToastHandler}/>}/>
                        <Route path="lecture/:lectureId" element={<LectureView showToastHandler={showToastHandler}/>}/>
                        <Route path="document/:id" element={<DocumentView/>}/>
                        <Route path="teacher/:name" element={<TeacherView showToastHandler={showToastHandler}/>}/>
                    </Route>
                    <Route path="/login" element={<LoginView/>}/>
                    <Route path="/register" element={<RegisterView/>}/>
                </Routes>
                <ToastComponent variant={toastVariant} content={toastContent} showToast={showToast} closeToast={closeToastHandler}/>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App;
