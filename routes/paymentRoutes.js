const express = require('express');
const paymentServiceController = require('../controllers/paymentController');
const router = express.Router();

// Payment CRUD routes
router.post('/', paymentServiceController.createPayment);
router.get('/', paymentServiceController.getAllPayments);
router.get('/:id', paymentServiceController.getPaymentById);
router.put('/:id', paymentServiceController.updatePayment);
router.delete('/:id', paymentServiceController.deletePayment);

// Additional payment-related operations
router.post('/repay', paymentServiceController.processRepayment);
router.post('/make-payment', paymentServiceController.makePayment);

module.exports = router;
