import axios from "axios";
import { useContext, createContext, useState, useEffect } from "react";
import { useAuth } from "../Login/AuthContext";
import questions from "../../data/questions";

const GameContext = createContext();

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

const GameProvider = ({ children }) => {
    const [dynamicIdealPoints, setDynamicIdealPoints] = useState([10, 50, 100]);
    const [hasExecuted, setHasExecuted] = useState(false);

    // const [hintsUsedForQuestion, setHintsUsedForQuestion] = useState(0);

    const [gameData, setGameData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const selectInitialQuestion = () => {
        const questionList = questions["easy"];
        return questionList[Math.floor(Math.random() * questionList.length)];
    }

    const setDataNewUser = async (username) => {
        const selectedQuestion = selectInitialQuestion();

        const initialGameData = {
            currentDifficulty: "easy",
            currentQuestion: selectedQuestion,
            points: 0,
            startTime: Date.now(),
            badges: [],
            retryCount: 0,
            usedQuestions: {
                easy: [selectedQuestion],
                medium: [],
                hard: [],
            },
            playerPoints: {
                easy: [],
                medium: [],
                hard: [],
            },
            hintsUsedForQuestion: 0,
        };

        setGameData(initialGameData);

        try {
            const response = await axios.post(`${apiUrl}/game/starter-game-data`, {
                initialGameData
            }, { withCredentials: true });
            return;
        }
        catch(err) {
            console.error(err);
        }
    }

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
        ) {
            updateGameData("currentDifficulty", "medium");
            updateGameData("points", 0);
        }
        else if (gameData.currentDifficulty == "medium"
            && newPoints >= 120
            // this part doesn't seem to be correct
            && gameData.playerPoints.easy.filter((p) => p >= dynamicIdealPoints[0]).length >= 3
        ) {
            updateGameData("currentDifficulty", "hard");
            updateGameData("points", 0);
        }
        else {
            updateGameData("points", newPoints);
        }
    };

    const fetchGameData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/game/load-data`, { withCredentials: true });
            if(response.data.gameData)
                setGameData(response.data.gameData.gameData);
        }
        catch (err) {
            console.log(err);
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchGameData();
        if(Object.keys(gameData).length===0){
            setDataNewUser();
        }
      }, []);

    return (
        <GameContext.Provider value={{ gameData, loading, error, updateGameData, updatePoints, updateGameDataObjects, resetUsedQuestions }}>
            {children}
        </GameContext.Provider>
    );
};

export default GameProvider;

export const useGame = () => useContext(GameContext);