const express = require('express');
 
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/sort/:type', productController.getAll);
router.get('/admin/all', productController.adminAll);
router.get('/:id', productController.getOne);
router.get('/new/page', (req, res) => res.render('product/new', {product: {}, error:[]}));
router.put('/:id', productController.toggleOnSale);
router.post('/', productController.createOne);
router.post('/update/:id', productController.updateOne); // 之後ajax實作put

module.exports = router;
