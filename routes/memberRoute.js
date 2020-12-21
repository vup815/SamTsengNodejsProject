const express = require('express');
const router = express.Router();

const memberController = require('../controllers/memberController');


router.get('/member/login', memberController.getLogin);
router.get('/member/register', memberController.getRegister);
router.post('/member/login', memberController.postLogin);
router.post('/member/register', memberController.postRegister);



module.exports = router;