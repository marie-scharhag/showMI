import {Form, FormGroup} from "react-bootstrap";
import {useState} from "react";
import {Room} from "../../Objects";

interface Props{
    room: Room
}
export function BeamerField({room}:Props) {
    const [beamerName, setBeamerName] = useState("")
    const [beamerIp, setBeamerIp] = useState("")
    const [beamerPort, setBeamerPort] = useState("")
    return(<div className="mb-3">
        <FormGroup className="mb-3">
            <Form.Control type="text" value={beamerName} onChange={(e)=> setBeamerName(e.target.value)}/>
        </FormGroup>
        <FormGroup className="mb-3">
            <Form.Control type="text" value={beamerIp} onChange={(e)=> setBeamerIp(e.target.value)}/>
        </FormGroup>
        <FormGroup className="mb-3">
            <Form.Control type="text" value={beamerPort} onChange={(e)=> setBeamerPort(e.target.value)}/>
        </FormGroup>
    </div>)
}