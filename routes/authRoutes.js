// routes/authRoutes.js

const express = require('express');
const { check } = require('express-validator');
const authController = require('../authController');

const router = express.Router();

router.post('/signup', [
    check('email').isEmail().withMessage('Valid email is required'),
    check('username').not().isEmpty().withMessage('Username is required'),
    check('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters'),
], authController.register);

router.post('/login', [
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').exists().withMessage('Password is required')
], authController.login);

module.exports = router;
