const express = require('express');
 
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/products', productController.get_all);
router.get('/products/:id', productController.get_one);
router.get('/products/:id/update', productController.get_one_for_update);
router.get('/product/new', productController.new_product_page);
router.post('/product/new', productController.new_product);
router.post('/product/:id/update', productController.update_product);

module.exports = router;
