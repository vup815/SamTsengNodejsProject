const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error('Please upload an image'))
        }
        cb(null, true)
    }
});

const memberController = require('../controllers/memberController');


router.get('/login', memberController.getLogin);
router.get('/register', memberController.getRegister);
router.get('/logout', memberController.logout);
router.post('/login', memberController.postLogin);
router.post('/register', upload.single('avatar'), memberController.postRegister);



module.exports = router;