import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {client} from "../App";
import {jwtDecode} from "jwt-decode";
import {useNavigate} from "react-router-dom";
import {AuthContextType, JWTToken, UserObject} from "../Objects"

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;

export const AuthProvider = ({children}: { children: ReactNode }) => {
    let navigate = useNavigate();

    const tokens = localStorage.getItem('authTokens')

    const [authTokens, setAuthTokens] = useState<JWTToken | null>(tokens ? JSON.parse(tokens) : null);
    const [user, setUser] = useState(tokens ? JSON.parse(JSON.stringify(jwtDecode(JSON.parse(tokens).access))).user : null);
    const [loading, setLoading] = useState(true);

    /**
     * Authenticates the user by making a POST request to the server with provided email and password.
     *
     * @param email - The user's email.
     * @param password - The user's password.
     */
    const login = async (email: string, password: string) => {
        await client.post(
            '/api/users/token/',
            {
                email: email,
                password: password,
            }
        ).then(
            (response) => {
                // console.log(response);
                setAuthTokens(response.data)
                const decodedJWTString = JSON.stringify(jwtDecode(response.data.access))

                const user: UserObject = JSON.parse(decodedJWTString).user
                setUser(user)

                localStorage.setItem('authTokens', JSON.stringify(response.data))
                navigate("/")
            }
        ).catch(() => {
                //TODO lieber ToastComponent alert nervt
                alert('You not authenticated')
            }
        )


    }

    /**
     * Logs the user out by clearing authentication tokens and redirecting to the login page.
     */
    const logout = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        console.log("LOGOUT", localStorage.getItem('user'))
        navigate("/login");
    };

    /**
     * Updates the authentication token by making a POST request to the server with the refresh token.
     * Also refreshes the user data.
     */
    const updateToken = async () => {
        // console.log("UPDATE")
        if (authTokens) {
            await client.post('/api/users/token/refresh/', {'refresh': authTokens?.refresh})
                .then((response) => {
                    setAuthTokens(response.data)
                    const decodedJWTString = JSON.stringify(jwtDecode(response.data.access))

                    const user: UserObject = JSON.parse(decodedJWTString).user
                    setUser(user)

                    localStorage.setItem('authTokens', JSON.stringify(response.data))
                }).catch(() => {
                        logout()
                    }
                )

        }

        if (loading) {
            setLoading(false)
        }
    }


    useEffect(() => {
        if (loading) {
            updateToken()
        }
        const time = 1000 * 60 * 4;
        const interval = setInterval(() => {
            if (authTokens) {
                updateToken()
            }
        }, time)
        return () => clearInterval(interval)

    }, [authTokens, loading])

    return <AuthContext.Provider
        value={{user, authTokens, login, logout}}>{loading ? null : children}</AuthContext.Provider> //
}

    /**
     * Custom hook to access the authentication context.
     * Throws an error if used outside the AuthProvider.
     *
     * @returns The authentication context.
     */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};