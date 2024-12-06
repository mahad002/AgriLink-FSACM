const express = require('express');
const { getCreditScore, updateCreditScoreOnRepayment } = require('../controllers/CreditScoreController');
const router = express.Router();

// Route to fetch the credit score for a user
router.get('/:userId', getCreditScore);

// Route to update the credit score based on repayment
router.post('/repayment', updateCreditScoreOnRepayment);

module.exports = router;
