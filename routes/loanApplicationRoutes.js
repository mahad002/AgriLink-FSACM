const express = require('express');
const loanServiceController = require('../controllers/loanServiceController');
const router = express.Router();

// CRUD routes for loan applications
router.post('/', loanServiceController.createLoanApplication);
router.get('/', loanServiceController.getAllLoanApplications);
router.get('/:id', loanServiceController.getLoanApplicationById);
router.put('/:id', loanServiceController.updateLoanApplication);
router.delete('/:id', loanServiceController.deleteLoanApplication);

// Approve or reject a loan application
router.put('/:id/status', loanServiceController.approveOrRejectLoan);

module.exports = router;
