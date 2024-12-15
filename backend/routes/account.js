const express = require('express');

const router = express.Router();

// router.get();

router.post("/register", (req, res) => {
    console.log(req.body);
    const { firstName, lastName, username, password } = req.body;
    
    // still gotta organize the way of saving data
    const data = { user: {firstName: firstName, lastName: lastName, username: username,}, token: 123};
    res.json(data);
});

module.exports = router;