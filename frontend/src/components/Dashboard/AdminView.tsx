import React, {useEffect} from 'react'
import styled from "styled-components";
import {useAuth} from "../../auth/AuthProvider";
import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import {Breadcrumb, Col, Row, Stack} from "react-bootstrap";
import {UsersView} from "./UsersView";
import {RoomsView} from "./RoomsView";
import {TimetableView} from "./TimetableView";
import {DocumentsView} from "./DocumentsView";

export function AdminView(){


    return(
        <Container>
            <Row className="mx-3">
               <Col sm="4">
                   <UsersView></UsersView>
               </Col>
                <Col sm="4">
                   <RoomsView></RoomsView>
               </Col>
                <Col sm="4">
                    <Stack gap={4}>
                        <TimetableView></TimetableView>
                        <DocumentsView></DocumentsView>
                    </Stack>
               </Col>
            </Row>

        </Container>

    )
}

const Container = styled.div`
`;