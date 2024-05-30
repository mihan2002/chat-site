const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');


router.get('', userController.renderMainPage);
router.get('/login', userController.renderLogin);
router.post('/login', userController.handleLogin);
router.get('/register', userController.renderRegister);
router.post('/register', userController.handleRegister);

module.exports = router;
