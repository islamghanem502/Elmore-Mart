const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/', protect, admin, getAllOrders);
router.get('/me', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
