import React, {useEffect} from 'react';
import {useAsyncFn} from "react-use";
import {useAuth} from "../../auth/AuthProvider";
import {Room, RoomMultiselectOption} from "../../Objects";
import {getAllRooms, getRoomsInStudy} from "../../services/RoomService";
import Multiselect from "multiselect-react-dropdown";


interface Props{
    rooms: Room[],
    setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
}
export function RoomMultiselect({rooms, setRooms}:Props) {
    const {authTokens} = useAuth()
    const study = 'MI'

    const [allRoomsState, getRooms] = useAsyncFn(async () => {
        if (!authTokens) return;
        const response = await getAllRooms(authTokens);
        const rooms: Array<Room> = response.data;
        return rooms;
    });

    useEffect(() => {
        getRooms();
    }, []); // Der leere Array als zweites Argument sorgt dafür, dass useEffect nur einmal ausgeführt wird (wie componentDidMount)

    function transformRoomToMultiselectOptions(rooms: Room[]): RoomMultiselectOption[] {
        return rooms.map((room) => ({
            name: `${room.roomNr}`,
            id: room.roomNr,
        }));
    }

    function handleRoomSelect(selectedList: RoomMultiselectOption[], selectedItem: RoomMultiselectOption) {
        const selectedRoom = allRoomsState.value?.find((room) => room.roomNr === selectedItem.name);
        selectedRoom && setRooms((prev) => [...prev, selectedRoom]);
    }

    function handleRoomRemove(selectedList: RoomMultiselectOption[], removedItem: RoomMultiselectOption) {
        const updatedRooms = rooms.filter((room) => room.roomNr !== removedItem.name);
        setRooms(updatedRooms);
    }

    return (
        <Multiselect
            options={allRoomsState.value && transformRoomToMultiselectOptions(allRoomsState.value)}
            selectedValues={transformRoomToMultiselectOptions(rooms)}
            onSelect={handleRoomSelect}
            onRemove={handleRoomRemove}
            displayValue="name"
            placeholder="Select Room"
            emptyRecordMsg={allRoomsState.error && "No Users available"}
            loading={allRoomsState.loading}
        />
    );
};