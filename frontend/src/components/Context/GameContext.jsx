import axios from "axios";
import { useContext, createContext, useState, useEffect } from "react";
import { useAuth } from "../Login/AuthContext";

const GameContext = createContext();

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

const GameProvider = ({ children }) => {
    const [dynamicIdealPoints, setDynamicIdealPoints] = useState([10, 50, 100]);
    const [hasExecuted, setHasExecuted] = useState(false);

    const [gameData, setGameData] = useState({
        currentDifficulty: "easy", // completed
        currentQuestion: {
            question: "",
            answer: "",
            points: 0,
        }, // completed
        points: 0, // completed
        startTime: 0, // ask if it's been used
        badges: ["joinExpert", "quickSolver"], // it's working, just gotta add it to user properly
        retryCount: 0, // completed
        usedQuestions: {
            easy: [],
            medium: [],
            hard: [],
        },
        playerPoints: {
            easy: [],
            medium: [],
            hard: [],
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const user = useAuth();

    const updateGameData = (key, value) => {
        setGameData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const updateGameDataObjects = (key, value) => {
        setGameData((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                [gameData.currentDifficulty]: [...prev[key][gameData.currentDifficulty], value]
            }
        }));
    };

    const resetUsedQuestions = () => {
        setGameData((prev) => ({
            ...prev,
            usedQuestions: {
                ...prev.usedQuestions,
                [gameData.currentDifficulty]: []
            }
        }));
    }

    // for now playerPoints is passed as a parameter, but after it will be from the gameData
    const updatePoints = (prevPoints, earnedPoints) => {
        const newPoints = prevPoints + earnedPoints;
        if (gameData.currentDifficulty == "easy" 
            && newPoints >= 100
            && gameData.playerPoints.easy.filter((p) => p >= dynamicIdealPoints[0]).length >= 4
        ){
            updateGameData("currentDifficulty", "medium");
            updateGameData("points", 0);
        }
        else if (gameData.currentDifficulty == "medium" 
            && newPoints >= 120
            // this part doesn't seem to be correct
            && gameData.playerPoints.easy.filter((p) => p >= dynamicIdealPoints[0]).length >= 3
        ){
            updateGameData("currentDifficulty", "hard");
            updateGameData("points", 0);
        }
        else {
            updateGameData("points", newPoints);
        }   
    };

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

    console.log(gameData);

    return (
        <GameContext.Provider value={{ gameData, loading, error, updateGameData, updatePoints, updateGameDataObjects, resetUsedQuestions }}>
            {children}
        </GameContext.Provider>
    );
};

export default GameProvider;

export const useGame = () => useContext(GameContext);