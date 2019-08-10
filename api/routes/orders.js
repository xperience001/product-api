const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.route('/')
.get(controller.getOrderBase)

router.route('/orders')
.get(controller.getAllOrders)
.post(controller.createOrder);

router.route('/orders/:id')
.get(controller.getOrder)
.delete(controller.deleteOrder);

module.exports = router;