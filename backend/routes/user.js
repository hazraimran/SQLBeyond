const express = require('express');
const session = require('express-session');
const { connectToMongoDB } = require('../utils/mongodb');

const router = express.Router();

const bcrypt = require('bcrypt');
const saltRounds = 10;

router.use(session({
    secret: "create a better secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

router.get("/login", async (req, res) => {
    if (req.session.user) {
        const db = await connectToMongoDB();
        const collection = db.collection('users');
        // make the request to the database with the username
        try{
            const user = await collection.findOne({username: req.session.user.username});
            if(user)
                return res.json({ user: user });

            throw new Error(); 
        } catch(err){
            console.error("Not able to load user data: ", err);
        }
    }
    res.status(404);
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const db = await connectToMongoDB();
    const collection = db.collection('users');

    // make the request to the database with the username
    const user = await collection.findOne({username: username});
    if(user){
        try{
            const response = await bcrypt.compare(password, user.password);
            if (response) {
                req.session.user = {username: username};
                if(user.company && user.position){
                    if(!user.quizData)
                        res.send({ user: user, missingQuiz: true });
                    else
                        res.send({ user: user });
                }
                else{
                    res.send({ user: user, isFirstTime: true });
                }
            }
            else {
                res.send({ msg: "Username and password don't match!" });
            }
        } catch (err) {
            console.error("Failed to check the password", err);
        }
    }
    else{
        //user not found
        res.send({ msg: "Username and password don't match!" });
    }
});

router.post("/register", async (req, res) => {
    const { firstName, lastName, username, password } = req.body;
    const db = await connectToMongoDB();
    const collection = db.collection('users');

    //check if user name already exists 
    try{
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);

        try{
            await collection.insertOne({
                firstName: firstName,
                lastName: lastName,
                username: username,
                password: hash,
                isOauth: false,
                badges: []
            }); 
            const userData = { user: { firstName: firstName, lastName: lastName, username: username, isOauth: false, badges: [] }};
            //store only the userID
            req.session.user =  { username: username };
            res.json(userData);
        }catch(err){
            console.error("Failed to insert new user: ", err);
            res.json({status: "failed"});
        }

    }catch(err){
        console.error("Failed to generate a hash password: ", err);
        res.json({status: "failed"});
    }
});

router.post('/google-oauth-login', async (req, res) => {
    try {
        const { given_name, family_name, email } = req.body.user;
        const db = await connectToMongoDB();
        const collection = db.collection('users');

        let userData;

        const checkUser = await collection.findOne({username: email});
        // when adding to the database, just check if the user exists, if it doesn't we add it to the database, otherwise just return the data given by google
        if(!checkUser){
            try{
                await collection.insertOne({
                    firstName: given_name,
                    lastName: family_name,
                    username: email,
                    password: null,
                    isOauth: true,
                    badges: []
                });   
                userData = { user: { firstName: given_name, lastName: family_name, username: email, isOauth: true, badges: []}, isFirstTime: true };  
            }catch(err){
                console.error("Failed to insert new user: ", err);
                res.json({status: "failed"});
            }
        }
        else{
            // console.log(checkUser);
            if(checkUser.company && checkUser.position){
                if(!checkUser.quizData)
                    userData = { user: checkUser, missingQuiz: true };
                else
                    userData = { user: checkUser };
            }
            else
                userData = { user: checkUser, isFirstTime: true };
        }
        //save only the userID
        req.session.user = { username: email };
        res.json(userData);
    }
    catch (err) {
        console.error(err);
    }
})

router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            res.send("Logout failed!");
            return;
        }

        res.clearCookie('connect.sid');
        res.json({message: "Logout succesfull"});
    })
});

router.post("/application-details", async (req, res) => {
    const { company, position } = req.body;
    const db = await connectToMongoDB();
    const collection = db.collection('users');

    // console.log(req.session.user);

    try{
        await collection.updateOne({
            username: req.session.user.username
        }, {
            $set: {
                company: company,
                position: position
            }
        });   
        res.json({success: true}); 
    }catch(err){
        console.error("Failed to update user: ", err);
        res.json({status: "failed"});
    }
});

router.post("/quiz-grade", async (req, res) => {
    const { quizData } = req.body;
    const db = await connectToMongoDB();
    const collection = db.collection('users');

    console.log(req.session.user);

    try{
        await collection.updateOne({
            username: req.session.user.username
        }, {
            $set: {
                quizData: quizData
            }
        });   
        res.json({success: true}); 
    }catch(err){
        console.error("Failed to update user: ", err);
        res.json({status: "failed"});
    }
});

module.exports = router;