import {Navigate, Route, RouteProps, useNavigate} from "react-router-dom";
import {JSX, ReactNode} from "react";
import {RedirectFunction} from "react-router-dom";
import {useAuth} from "./AuthProvider";



const PrivateRoute = ({children, ...rest}: { children: JSX.Element }):JSX.Element => {
    let {authTokens, user} = useAuth()
    const navigate = useNavigate()
    if(!authTokens)
        return(<Navigate to="/login" />)

    return children
}

export default PrivateRoute;
