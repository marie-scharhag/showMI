import {UserMultiselectOption, UserObject} from "../../Objects";
import {useAsyncFn} from "react-use";
import {useAuth} from "../../auth/AuthProvider";
import {getAllUsers} from "../../services/UserService";
import {useEffect} from "react";
import Multiselect from "multiselect-react-dropdown";

interface Props {
    teachers: UserObject[];
    setTeachers: React.Dispatch<React.SetStateAction<UserObject[]>>;
}

export function UserMultiselect({teachers, setTeachers}: Props) {
    const {authTokens} = useAuth()

    useEffect(() => {
        getUsers();
    }, []);

    const [allUsersState, getUsers] = useAsyncFn(async () => {
        if (!authTokens) return;
        const response = await getAllUsers(authTokens);
        const users: Array<UserObject> = response.data;
        return users;
    });

    function transformUserToMultiselectOptions(users: UserObject[]): UserMultiselectOption[] {
        return users.map((user) => ({
            name: `${user.first_name} ${user.last_name}`,
            id: user.id,
        }));
    }

    function handleUserSelect(selectedList: UserMultiselectOption[], selectedItem: UserMultiselectOption) {
        const selectedUser = allUsersState.value?.find((user) => user.id === selectedItem.id);
        selectedUser && setTeachers((prev) => [...prev, selectedUser]);
    }

    function handleUserRemove(selectedList: UserMultiselectOption[], removedItem: UserMultiselectOption) {
        const updatedUsers = teachers.filter((user) => user.id !== removedItem.id);
        setTeachers(updatedUsers);
    }

    return (
        <Multiselect
            options={allUsersState.value && transformUserToMultiselectOptions(allUsersState.value)}
            selectedValues={transformUserToMultiselectOptions(teachers)}
            onSelect={handleUserSelect}
            onRemove={handleUserRemove}
            displayValue="name"
            placeholder="Select Teacher"
            emptyRecordMsg={allUsersState.error && "No Users available"}
            loading={allUsersState.loading}
        />
    );
};