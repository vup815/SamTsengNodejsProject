const express = require('express');
 
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/', cartController.getAll);
router.get('/ajax', cartController.ajaxGetAll);
router.get('/cartNum', cartController.getCartNum);
router.post('/:id', cartController.addOne);
router.delete('/:id', cartController.deleteOne);

module.exports = router;