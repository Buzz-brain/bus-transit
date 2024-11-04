// routes/protectedRoutes.js

const express = require('express');
const authMiddleware = require('./middleware/authMiddleware');

const router = express.Router();

router.get('/dashboard', authMiddleware, (req, res) => {
    // Return data only if the user is authenticated
    res.json({ message: "Welcome to the protected dashboard!" });
});

module.exports = router;
