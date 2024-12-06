const axios = require('axios');
const { updateCreditScore } = require('../utils/creditScoreCalculator');
require('dotenv').config();

const CREDIT_SCORE_SERVICE_URL = process.env.DB_SERVICE_URL;

// Fetch credit score for a user
const getCreditScore = async (req, res) => {
    try {
        const response = await axios.get(`${CREDIT_SCORE_SERVICE_URL}/creditscores/${req.params.userId}`);
        const creditScore = response.data;
        if (!creditScore) return res.status(404).json({ success: false, message: 'Credit score not found.' });

        res.json({ success: true, data: creditScore });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching credit score.', error: error.message });
    }
};

// Update credit score based on repayment status
const updateCreditScoreOnRepayment = async (req, res) => {
    try {
        const { userId, repaymentStatus, loanAmount } = req.body;

        // Fetch the credit score
        let creditScoreResponse = await axios.get(`${CREDIT_SCORE_SERVICE_URL}/creditscores/${userId}`);
        let creditScore = creditScoreResponse.data;

        // If not found, create a new credit score for the user
        if (!creditScore) {
            const newCreditScoreResponse = await axios.post(`${CREDIT_SCORE_SERVICE_URL}/creditscores`, { userId });
            creditScore = newCreditScoreResponse.data;
        }

        // Update the credit score locally using the utility function
        creditScore = updateCreditScore(creditScore, repaymentStatus, loanAmount);

        // Save the updated credit score back to the DB service
        const updatedCreditScoreResponse = await axios.put(
            `${CREDIT_SCORE_SERVICE_URL}/creditscores/${userId}`,
            creditScore
        );

        res.json({ success: true, data: updatedCreditScoreResponse.data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating credit score.', error: error.message });
    }
};

module.exports = { getCreditScore, updateCreditScoreOnRepayment };
