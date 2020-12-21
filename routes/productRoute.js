const express = require('express');
 
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAll);
router.get('/:id', productController.getOne);
router.get('/new/page', (req, res) => res.render('products/create'));
router.post('/', productController.createOne);
router.post('/update/:id', productController.updateOne); // 之後ajax實作put

module.exports = router;
