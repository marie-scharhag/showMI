import React, {useEffect, useState} from 'react'
import styled from "styled-components";
import {useAuth} from "../../auth/AuthProvider";
import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import {Breadcrumb, Col, Row, Stack} from "react-bootstrap";
import {UsersView} from "./UsersView";
import {RoomsView} from "./RoomsView";
import {TimetableView} from "./TimetableView";
import {DocumentsView} from "./DocumentsView";
import {Variant} from "react-bootstrap/types";
import {ToastComponent} from "../ToastComponent";

interface Props {
    showToastHandler: (content: string, variant: Variant) => void;
}
export function AdminView({showToastHandler}:Props) {
    // const [showToast, setShowToast] = useState(false);
    // const [toastContent, setToastContent] = useState('');
    // const [toastVariant, setToastVariant] = useState<Variant>("");
    //
    // const showToastHandler = (content:string, variant:Variant) => {
    //     setToastContent(content);
    //     setToastVariant(variant);
    //     setShowToast(true);
    // };
    //
    // const closeToastHandler = () => {
    //     setShowToast(false);
    // };


    return (
        <Container>
            <Row className="mx-3">
                <Col sm="4">
                    <UsersView showToastHandler={showToastHandler}></UsersView>
                </Col>
                <Col sm="4">
                    <RoomsView showToastHandler={showToastHandler}></RoomsView>
                </Col>
                <Col sm="4">
                    <Stack gap={4}>
                        <TimetableView showToastHandler={showToastHandler}></TimetableView>
                        <DocumentsView showToastHandler={showToastHandler}></DocumentsView>
                    </Stack>
                </Col>
            </Row>
            {/*<ToastComponent variant={toastVariant} content={toastContent} showToast={showToast} closeToast={closeToastHandler}/>*/}

        </Container>

    )
}

const Container = styled.div`
`;