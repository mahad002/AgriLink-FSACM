const axios = require('axios');
const stripe = require('../utils/stripe');
require('dotenv').config();

const BASE_URL = process.env.DB_SERVICE_URL;

// Create a new loan repayment
exports.createLoanRepayment = async (req, res) => {
    const { loanId, repaymentDate, amountPaid, customerId, paymentMethodId } = req.body;

    try {
        // Fetch loan details from the central microservice
        const loanResponse = await axios.get(`${BASE_URL}/loan-applications/${loanId}`);
        const loan = loanResponse.data?.data;

        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        // Create a Stripe payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountPaid * 100,
            currency: 'pkr',
            payment_method: paymentMethodId,
            customer: customerId,
            confirm: true,
        });

        // Handle payment failure
        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({
                success: false,
                message: 'Payment failed',
                error: paymentIntent.last_payment_error?.message || 'Unknown error occurred',
            });
        }

        // Update loan's remaining balance
        loan.remainingBalance -= amountPaid;
        if (loan.remainingBalance <= 0) {
            loan.remainingBalance = 0;
            loan.status = 'completed';
        }

        // Save updated loan data in the central microservice
        await axios.put(`${BASE_URL}/loanapplications/${loanId}`, loan);

        // Save repayment details in the central microservice
        const repaymentResponse = await axios.post(`${BASE_URL}/loan-repayments`, {
            monitoringId: paymentIntent.id,
            loanId,
            repaymentDate: repaymentDate || new Date(),
            amountPaid,
            remainingBalance: loan.remainingBalance,
            status: 'completed',
        });

        res.status(201).json({
            success: true,
            message: 'Loan repayment processed successfully',
            repayment: repaymentResponse.data?.data,
            loan,
        });
    } catch (error) {
        console.error('Repayment error:', error);
        res.status(500).json({
            success: false,
            message: 'Repayment processing failed',
            error: error.response?.data || error.message,
        });
    }
};

// Retrieve all loan repayments
exports.getAllLoanRepayments = async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/loan-repayments`, { params: req.query });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
    }
};

// Retrieve a loan repayment by ID
exports.getLoanRepaymentById = async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/loan-repayments/${req.params.id}`);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
    }
};

// Update a loan repayment by ID
exports.updateLoanRepayment = async (req, res) => {
    try {
        const repaymentId = req.params.id;
        const updatedData = req.body;

        // Fetch the existing repayment details
        const repaymentResponse = await axios.get(`${BASE_URL}/loan-repayments/${repaymentId}`);
        const existingRepayment = repaymentResponse.data?.data;

        if (!existingRepayment) {
            return res.status(404).json({ message: 'Loan repayment not found' });
        }

        // Fetch the associated loan details
        const loanResponse = await axios.get(`${BASE_URL}/loan-applications/${existingRepayment.loanId}`);
        const loan = loanResponse.data?.data;

        if (!loan) {
            return res.status(404).json({ message: 'Associated loan application not found' });
        }

        // Update repayment data in the central microservice
        const repaymentUpdateResponse = await axios.put(`${BASE_URL}/loan-repayments/${repaymentId}`, updatedData);
        const updatedRepayment = repaymentUpdateResponse.data?.data;

        // Adjust the loan's remaining balance
        const balanceAdjustment = updatedRepayment.amountPaid - existingRepayment.amountPaid;
        loan.remainingBalance -= balanceAdjustment;

        // Check if the loan is fully repaid
        if (loan.remainingBalance <= 0) {
            loan.remainingBalance = 0;
            loan.status = 'completed';
        }

        // Save updated loan details in the central microservice
        await axios.put(`${BASE_URL}/loan-applications/${loan._id}`, loan);

        res.json({
            success: true,
            message: 'Loan repayment updated successfully',
            updatedRepayment,
            updatedLoan: loan,
        });
    } catch (error) {
        console.error('Error updating loan repayment:', error);
        res.status(500).json({
            success: false,
            message: 'Loan repayment update failed',
            error: error.response?.data || error.message,
        });
    }
};

// Delete a loan repayment by ID
exports.deleteLoanRepayment = async (req, res) => {
    try {
        const repaymentResponse = await axios.delete(`${BASE_URL}/loan-repayments/${req.params.id}`);
        res.json(repaymentResponse.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
    }
};