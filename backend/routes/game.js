const express = require('express');
const { connectToMongoDB } = require('../utils/mongodb');

const router = express.Router();

router.get("/load-data", async (req, res) => {
    const { username } = req.body;
    const db = await connectToMongoDB();
    const collection = db.collection('game');

    try {
        const gameData = await collection.findOne({ username: username});
        if (gameData)
            return res.json({ gameData: gameData });

        throw new Error();
    } catch (err) {
        console.error("Not able to load game data: ", err);
    }
})

router.post("/quiz-grade", async (req, res) => {
    const { quizData } = req.body;
    const db = await connectToMongoDB();
    const collection = db.collection('game');

    console.log(req.session.user);

    try {
        await collection.updateOne({
            username: req.session.user.username
        }, {
            $set: {
                quizData: quizData
            }
        });
        res.json({ success: true });
    } catch (err) {
        console.error("Failed to update user: ", err);
        res.json({ success: false });
    }
});

router.post("/current-level", async (req, res) => {
    const { username, currentLevel } = req.body;
    const db = await connectToMongoDB();
    const collection = db.collection('users');

    try{
        await collection.updateOne({
            username: username
        }, {
            $set: {
                currentLevel: currentLevel
            }
        });
        res.json({ success: true });
    }
    catch(err){ 
        console.error("Failed to save current level in the database: ", err);
        return res.json({ success: false,  msg: "Failed to save current level in the database!" });     
    };
})


module.exports = router;