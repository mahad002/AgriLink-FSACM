const express = require('express');
const loanServiceController = require('../controllers/loanServiceController');
const router = express.Router();

router.post('/', loanServiceController.createLoanRepayment);
router.get('/', loanServiceController.getAllLoanRepayments);
router.get('/:id', loanServiceController.getLoanRepaymentById);
router.put('/:id', loanServiceController.updateLoanRepayment);
router.delete('/:id', loanServiceController.deleteLoanRepayment);

module.exports = router;
