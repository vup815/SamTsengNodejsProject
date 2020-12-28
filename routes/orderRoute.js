const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController');
router.get('/:status', orderController.getAll);
router.get('/', orderController.getLatest);
router.post('/', orderController.createOne);
router.put('/:id', orderController.modify);
module.exports = router;