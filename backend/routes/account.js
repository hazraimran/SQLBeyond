const express = require('express');
const session = require('express-session');

//for testing 
const { getAllUsers, addUser, removeUser, editUser, singleUser } = require('../persistence');

const router = express.Router();

const bcrypt = require('bcrypt');
const saltRounds = 10;


router.use(session({
    secret: "create a better secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24 * 7
    }
}));

router.get("/login", (req, res) => {
    if(req.session.user) {
        return res.json({ user: req.session.user });
    }
    res.status(404);
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;
    const db_password = "";

    // console.log(password);

    // make the request to the database with the username

    const userData = singleUser(username);

    // console.log(userData[0].password);

    bcrypt.compare(password, userData[0].password, (err, response) => {
        if(response){
            //user data will be returned by the db query
            req.session.user = userData[0];
            res.send({ loggedIn: true, user: userData[0]});
        }
        else{
            res.send({loggedIn: false, msg: "Username and password don't match!"});
        }
    })
});

router.post("/register", (req, res) => {
    // console.log(req.body);
    const { firstName, lastName, username, password } = req.body;

    // still gotta organize the way of saving data
    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) {
            console.error(err);
            return;
        }
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
                console.error(err);
                return;
            }
            
            // as I'm not sure which DB and how the data are being stored, I'm saving it locally for now
            // store in the db
            addUser(username, firstName, lastName, hash);

            // console.log(singleUser(username)[0]);

            const userData = { user: { firstName: firstName, lastName: lastName, username: username } };

            req.session.user = userData;

            // console.log(req.session);
            res.json(userData);
        })
    })
});

router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if(err){
            console.error(err);
            res.send("Logout failed!");
            return;
        }
        res.clearCookie('connect.sid');
        res.send("Logout succesfull");
    })
});

router.get("/getAllUsers", (req, res) => {
    console.log(getAllUsers());
    res.json(getAllUsers());
});

router.get("/print-sessions", (req, res) => {
    const sessionStore = req.sessionStore;
    sessionStore.all((err, sessions) => {
      if (err) {
        console.error("Error fetching sessions:", err);
        res.status(500).send("Failed to fetch sessions");
        return;
      }
      res.send(sessions);
    });
});

module.exports = router;