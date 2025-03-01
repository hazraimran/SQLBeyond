import axios from "axios";
import { useContext, createContext, useState, useEffect } from "react";
import { useAuth } from "../Login/AuthContext";

const GameContext = createContext();

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

const GameProvider = ({ children }) => {
    // const [result, setResult] = useState([]); // related to the results of the "run" or "submit"
    // const [correctAnswerResult, setCorrectAnswerResult] = useState(null);
    // const [message, setMessage] = useState("");
    // const [buttonsDisabled, setButtonsDisabled] = useState(true);

    // ---------------------------------------


    // const [currentQuestion, setCurrentQuestion] = useState({
    //     question: "",
    //     answer: "",
    //     points: 0,
    // });
    // const [currentDifficulty, setCurrentDifficulty] = useState(user.currentLevel ? user.currentLevel : "easy");
    // const [startTime, setStartTime] = useState(null);
    // const [points, setPoints] = useState(0);
    // const [badges, setBadges] = useState([]);
    // const [retryCount, setRetryCount] = useState(0);
    // const [usedQuestions, setUsedQuestions] = useState({
    //     easy: [],
    //     medium: [],
    //     hard: [],
    // });
    // const [playerPoints, setPlayerPoints] = useState({
    //     easy: [],
    //     medium: [],
    //     hard: [],
    // });


    const [dynamicIdealPoints, setDynamicIdealPoints] = useState([10, 50, 100]);
    const [hasExecuted, setHasExecuted] = useState(false);

    // ----------------------------------------

    const [gameData, setGameData] = useState({
        currentDifficulty: "easy", // completed
        currentQuestion: {
            question: "",
            answer: "",
            points: 0,
        }, // completed
        points: 0, // completed
        startTime: 0,
        badges: [],
        retryCount: 0,
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

    // for now playerPoints is passed as a parameter, but after it will be from the gameData
    const updatePoints = (prevPoints, earnedPoints, playerPoints) => {
        const newPoints = prevPoints + earnedPoints;
        if (gameData.currentDifficulty == "easy" 
            && newPoints >= 100
            && playerPoints.easy.filter((p) => p >= dynamicIdealPoints[0]).length >= 4
        ){
            updateGameData("currentDifficulty", "medium");
            updateGameData("points", 0);
        }
        else if (gameData.currentDifficulty == "medium" 
            && newPoints >= 120
            // this part doesn't seem to be correct
            && playerPoints.easy.filter((p) => p >= dynamicIdealPoints[0]).length >= 3
        ){
            updateGameData("currentDifficulty", "hard");
            updateGameData("points", 0);
        }
        else {
            updateGameData("points", newPoints);
        }   
    };

    // const saveUserLevel = (level) => {
    //     try{
    //       axios.post(`${apiUrl}/game/current-level`, {
    //         username: user.username,
    //         currentLevel: level
    //       }, { withCredentials: true });
    //     }
    //     catch(err){
    //       console.log(err);
    //     }
    // }

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
        <GameContext.Provider value={{ gameData, loading, error, updateGameData, updatePoints }}>
            {children}
        </GameContext.Provider>
    );
};

export default GameProvider;

export const useGame = () => useContext(GameContext);