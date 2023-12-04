import {UserObject} from "../Objects";
import {Toast, ToastBody, ToastContainer} from "react-bootstrap";
import {Variant} from "react-bootstrap/types";
import {useEffect, useState} from "react";

interface Props {
    variant: Variant;
    content: string;
    showToast: boolean;
    closeToast: () => void;
}

export function ToastComponent({variant, content, showToast, closeToast}: Props) {

    const [visible, setVisible] = useState(showToast);

    useEffect(() => {
        setVisible(showToast);

        if (showToast) {
            const timer = setTimeout(() => {
                closeToast();
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [showToast, closeToast]);
    return (
        <ToastContainer position={"top-end"}>
            <Toast show={visible} autohide delay={10000} onClose={closeToast}>
                <ToastBody>{content}</ToastBody>
            </Toast>
        </ToastContainer>
    )
}