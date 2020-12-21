const express = require('express');
const router = express.Router();

const memberController = require('../controllers/memberController');


router.get('/login', memberController.getLogin);
router.get('/register', memberController.getRegister);
router.post('/login', memberController.postLogin);
router.post('/register', memberController.postRegister);



module.exports = router;