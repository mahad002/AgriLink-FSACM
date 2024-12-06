const express = require('express');
const transactionServiceController = require('../controllers/transactionController');
const router = express.Router();

// Transaction CRUD routes
router.post('/', transactionServiceController.createTransaction);
router.get('/', transactionServiceController.getAllTransactions);
router.get('/:id', transactionServiceController.getTransactionById);
router.put('/:id', transactionServiceController.updateTransaction);
router.delete('/:id', transactionServiceController.deleteTransaction);
router.post('/confirm', transactionServiceController.confirmTransaction);

module.exports = router;
