const express = require('express');
const { connectToMongoDB } = require('../utils/mongodb');

const router = express.Router();

router.get("/", (req, res) => {

})

// router.post("/login", async (req, res) => {
//     const { username, password } = req.body;
//     const db = await connectToMongoDB();
//     const collection = db.collection('users');

//     // make the request to the database with the username
//     const user = await collection.findOne({username: username});
//     if(user){
//         try{
//             const response = await bcrypt.compare(password, user.password);
//             if (response) {
//                 req.session.user = {username: username};
//                 res.send({ user: user });
//             }
//             else {
//                 res.send({ msg: "Username and password don't match!" });
//             }
//         } catch (err) {
//             console.error("Failed to check the password", err);
//         }
//     }
//     else{
//         //user not found
//         res.send({ msg: "Username and password don't match!" });
//     }
// });

module.exports = router;