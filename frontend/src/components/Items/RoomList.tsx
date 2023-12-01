import React from 'react';
import {Row, Col} from 'react-bootstrap';
import {Room} from "../../Objects";
import {useNavigate} from "react-router-dom";
import styled from "styled-components";

interface Props {
    rooms: Room[];
}

interface GroupedRooms {
    [building: string]: { [floor: string]: Room[] };
}

export const RoomList = ({rooms}: Props) => {
    const navigate = useNavigate()

    const groupedRooms: { [building: string]: { [floor: string]: Room[] } } = rooms.reduce((acc, room) => {
        const buildingKey = room.building || 'Unknown Building';
        const floorKey = room.floor || 'Unknown Floor';

        if (!acc[buildingKey]) {
            acc[buildingKey] = {};
        }

        if (!acc[buildingKey][floorKey]) {
            acc[buildingKey][floorKey] = [];
        }

        acc[buildingKey][floorKey].push(room);

        return acc;
    }, {} as GroupedRooms);


    const renderGroupedRooms = () => {
        return Object.keys(groupedRooms).map((building) => (
            <Building key={building} className="mb-3 mx-3 px-3 pt-3">
                <h5>{building}</h5>
                {Object.keys(groupedRooms[building]).map((floor) => (
                    <div key={floor} className="mb-2">
                        <h6 className="floorName">{floor} <hr className="floorDivider"/></h6>

                        <Row className="my-2">
                            {groupedRooms[building][floor].map((room) => (
                                <Col key={room.roomNr} className="mb-3" xs="3">
                                    <RoomItem onClick={() => navigate(`/${room.roomNr}`, {state: {room: room}})}>
                                        {room.roomNr}
                                    </RoomItem>
                                </Col>
                            ))}
                        </Row>
                    </div>
                ))}
            </Building>
        ));
    };

    return <>{renderGroupedRooms()}</>;
};

const RoomItem = styled.div`
  font-size: 20px;
  background: #9BC328;
  box-shadow: 0px 3px 20px #E0E0E0;
  border-radius: 15px;
  text-align: center;
  padding: 8px 0px 8px 0px
`;

const Building = styled.div`
  background: white;
  box-shadow: 0px 3px 20px #F2F2F2;
  border-radius: 5px;

  .divider {
    display: flex;
  }

  .divider::after {
    flex: 1;
    content: '';
    height: 1px;
    background-color: black;
    position: relative;
    vertical-align: middle;
    margin: 11px;
  }

  .floorName {
    display: flex;
    align-items: center;
  }
  
  .floorDivider{
    flex: 1; 
    margin-left: 10px;
    border-top: 1px solid #000000;
  }
`;
