import axios, { Axios } from "axios";
import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

const AuthContext = createContext();

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const register = async (formData) => {
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
                navigate("/intro");
                return;
            }
            throw new Error(response.message);
        }
        catch (err) {
            console.error(err);
        }
    }

    const login = async (formData) => {
        console.log(formData)
        try {
            const response = await axios.post(`${apiUrl}/account/login`, {
                username: formData.username,
                password: formData.password
            });

            const data = response.data;
            console.log(data);
            if (data.loggedIn) {
                setUser(data.user);
                navigate("/intro");
                return;
            }
            else{
                alert(data.msg);
                navigate('/');
            }
            throw new Error(response.message);
        }
        catch (err) {
            console.error(err);
        }
    }

    const logout = async () => {
        try {
            console.log("trying to logout")
            await axios.post(`${apiUrl}/account/logout`);
            setUser(null);
            navigate("/");
        }
        catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {

        const loadUser = async () => {
            try {
                const response = await axios.get(`${apiUrl}/account/login`);
                    if (response.data) {
                        setUser(response.data.user);
                    }
                    else {
                        setUser(null);
                    }    
            }
            catch(err) {
                setUser(null);
            }
            finally{
                setLoading(false);
            }
        }

        loadUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, register, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);