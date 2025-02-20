import axios from "axios";
import { useContext, createContext, useState, useEffect } from "react";
import { useAuth } from "../Login/AuthContext";

const GameContext = createContext();

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

const GameProvider = ({ children }) => {
    const [gameData, setGameData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const user = useAuth();

    // useEffect(() => {
    //     const fetchGameData = async () => {
    //         try {
    //             if(user.username){
    //                 const response = await axios.get(`${apiUrl}/game/load-data`, {username: user.username});
    //                 setGameData(response.data);
    //             }
    //         } catch (err) {
    //             setError(err.message);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchGameData();
    // }, []);

    return (
        <GameContext.Provider value={{ gameData, loading, error }}>
            {children}
        </GameContext.Provider>
    );
};

export default GameProvider;

export const useGame = () => useContext(GameContext);