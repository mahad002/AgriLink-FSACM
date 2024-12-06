const express = require('express');
const loanRepaymentMonitoringController = require('../controllers/loanRepaymentMonitoringController');
const router = express.Router();

router.post('/', loanRepaymentMonitoringController.createLoanRepayment);
router.get('/', loanRepaymentMonitoringController.getAllLoanRepayments);
router.get('/:id', loanRepaymentMonitoringController.getLoanRepaymentById);
router.put('/:id', loanRepaymentMonitoringController.updateLoanRepayment);
router.delete('/:id', loanRepaymentMonitoringController.deleteLoanRepayment);

module.exports = router;
