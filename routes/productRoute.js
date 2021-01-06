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

const productController = require('../controllers/productController');

router.get('/sort/:type', productController.getAll);
router.get('/admin/all', productController.adminAll);
router.get('/:id', productController.getOne);
router.get('/new/page', (req, res) => res.render('product/new', { product: {}, error: [] }));
router.put('/:id', productController.toggleOnSale);
router.post('/', upload.single('picture'), productController.createOne);
router.post('/update/:id', upload.single('picture'), productController.updateOne);

module.exports = router;
