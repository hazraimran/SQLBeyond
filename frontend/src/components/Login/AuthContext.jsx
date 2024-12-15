import axios from "axios";
import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState("");
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const login = async (formData) => {
        try {
            const response = await axios.post(`${apiUrl}/account/register`, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                username: formData.username,
                password: formData.password
            });

            const data = response.data;
            console.log(data);
            if (data) {
                setUser(data.user);
                setToken(data.token);
                // localStorage.setItem("site", data.token);
                navigate("/intro");
                return;
            }
            throw new Error(response.message);
        }
        catch (err) {
            console.error(err);
        }
    }

    const logout = async () => {
        setUser(null);
        setToken("");
        // localStorage.removeItem("site");
        navigate("/");

        // try {
        //     await axios.post(`${apiUrl}/account/register`, {});
        // }
        // catch (err) {
        //     console.error(err);
        // }
    }

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
}