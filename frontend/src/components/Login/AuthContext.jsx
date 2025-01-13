import axios from "axios";
import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";

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
            }, { withCredentials: true });

            const data = response.data;
            
            console.log(data);

            if (data.user) {
                console.log(data.user);
                setUser(data.user);
                setLoading(false);
                navigate("/intro");
                navigate(0);
                return;
            }
            throw new Error(response.message);
        }
        catch (err) {
            console.error(err);
        }
    }

    const login = async (formData) => {
        // console.log(formData)
        try {
            const response = await axios.post(`${apiUrl}/account/login`, {
                username: formData.username,
                password: formData.password
            }, { withCredentials: true });

            const data = response.data;
            // console.log("inside login: ", data.user);
            if (data.user) {
                setUser(data.user);

                // console.log(data.user);

                setLoading(false);
                if(response.data.isFirstTime)
                    return navigate("/intro");

                if(response.data.missingQuiz)
                    return navigate("/query")

                return navigate("/SQLEditor");
            }
            else {
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
            // console.log("trying to logout")
            await axios.post(`${apiUrl}/account/logout`, {}, { withCredentials: true });
            // console.log(response.data);
            if(user.isOauth)
                googleLogout();
            
            setUser(null);
            setLoading(true);
            navigate("/");
        }
        catch (err) {
            console.error(err);
        }
    }

    const googleOauth = useGoogleLogin({
        onSuccess: async (resCode) => {
            try {
                const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {
                        Authorization: `Bearer ${resCode.access_token}`
                    },
                    withCredentials: false
                })

                const data = userInfo.data;

                const response = await axios.post(`${apiUrl}/account/google-oauth-login`, {
                    user: data
                }, {withCredentials: true});

                if (response.data.user) {
                    setUser(response.data.user);
                    setLoading(false);

                    // console.log(response.data);

                    if(response.data.isFirstTime)
                        return navigate("/intro");

                    if(response.data.missingQuiz)
                        return navigate("/query")

                    return navigate("/SQLEditor");
                }
                throw new Error(response.message);
            }
            catch (err) {
                console.error(err);
            }
        },
        onError: (err) => console.log(`Login failed: ${err}`)
    });


    useEffect(() => {
        // console.log(user);
        const loadUser = async () => {
            try {
                const response = await axios.get(`${apiUrl}/account/login`, { withCredentials: true });
                // console.log(response.data);
                if (response.data) {
                    // console.log(response.data);
                    setUser(response.data.user);
                }
                else {
                    setUser(null);
                }
                // console.log("loading");  
            }
            catch (err) {
                setUser(null);
            }
            finally {
                // console.log("finally to false");
                setLoading(false);
            }
        }

        loadUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, register, login, logout, loading, googleOauth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);