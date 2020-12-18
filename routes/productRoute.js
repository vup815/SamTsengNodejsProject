const express = require('express');
 
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/products', productController.getAll);
router.get('/products/:id', productController.getOne);
router.get('/products/:id/update', productController.getOneForUpdate);
router.get('/product/create', productController.createPage);
router.post('/product/create', productController.createOne);
router.post('/product/:id/update', productController.updateOne);

module.exports = router;
