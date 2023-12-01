import React, {useEffect} from 'react'
import styled from "styled-components";
import {UsersView} from "./UsersView";
import {Breadcrumb, Col, Row, Stack} from "react-bootstrap";
import {RoomsView} from "./RoomsView";
import {DocumentsView} from "./DocumentsView";
import {TimetableView} from "./TimetableView";
import {NavbarView} from "./Navbar";
import {AdminView} from "./AdminView";
import {RoomView} from "../RoomView";
import {LectureView} from "../LectureView";
import {useAuth} from "../../auth/AuthProvider";
import {Outlet, useNavigate, Link, useLocation} from "react-router-dom";
import Button from "react-bootstrap/Button";

export function Dashboard() {
    const {user} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    useEffect(() => {
        if (user.is_staff) {
            navigate('/admin');
        } else {
            navigate(`/teacher/${user.first_name}_${user.last_name}`,{state:{user:user}});
        }
    }, [user.is_staff])

    return (
        <Container>
            <NavbarView></NavbarView>
            <Board className="m-3">
                <Breadcrumb className="ms-5 pt-3">
                    {pathnames.map((name, index) => {
                        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                        const isLast = index === pathnames.length - 1;
                        return (
                            <Breadcrumb.Item key={name} linkAs={Link} linkProps={{to: routeTo}}>
                                {isLast ? name : <span>{name}</span>}
                            </Breadcrumb.Item>
                        );
                    })}
                </Breadcrumb>
                <Outlet/>
            </Board>
        </Container>

    )
}

const Container = styled.div`

`;

const Board = styled.div`
  background-color: #E6EDED;
  height: calc(100vh - 100px);
  box-shadow: 0px 3px 20px #E6EDED;
  border-radius: 10px;
`;
