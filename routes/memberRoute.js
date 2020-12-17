const express = require('express');
const router = express.Router();

const MemberController = require('../controllers/memberController');
memberController = new MemberController();

// router.get('/member/login', memberController.get_login_page);
// router.get('/member/register', memberController.get_register_page);
// router.post('/member/login', memberController.post_login);
router.post('/member/register', memberController.postRegister);



module.exports = router;