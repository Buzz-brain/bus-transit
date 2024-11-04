// authRoutes.js

const express = require('express');
const { check } = require('express-validator');
const authController = require('./authController');

const router = express.Router();

router.post('/register', [
    check('busNumber').not().isEmpty().withMessage('Bus number is required'),
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], authController.register);

router.post('/login', [
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').exists().withMessage('Password is required')
], authController.login);

module.exports = router;
