const axios = require('axios');
const stripe = require('../utils/stripe');
const LoanRepaymentMonitoring = require('../models/LoanRepaymentMonitoring');
const { updateCreditScoreOnRepayment } = require('./CreditScoreController');
require('dotenv').config();

const BASE_URL = process.env.DB_SERVICE_URL;

// Create a new payment
exports.createPayment = async (req, res) => {
    try {
        const response = await axios.post(`${BASE_URL}/payments`, req.body);
        res.status(201).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
    }
};

// Retrieve all payments
exports.getAllPayments = async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/payments`, { params: req.query });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
    }
};

// Retrieve a payment by ID
exports.getPaymentById = async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/payments/${req.params.id}`);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
    }
};

// Update a payment by ID
exports.updatePayment = async (req, res) => {
    try {
        const response = await axios.put(`${BASE_URL}/payments/${req.params.id}`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
    }
};

// Delete a payment by ID
exports.deletePayment = async (req, res) => {
    try {
        const response = await axios.delete(`${BASE_URL}/payments/${req.params.id}`);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
    }
};

// Process a repayment
exports.processRepayment = async (req, res) => {
    try {
        const { repaymentId, status, amount } = req.body;

        // Find repayment in the central microservice
        const repaymentResponse = await axios.get(`${BASE_URL}/loan-repayments/${repaymentId}`);
        const repayment = repaymentResponse.data?.data;

        if (!repayment) {
            return res.status(404).json({ message: 'Repayment not found.' });
        }

        // Update repayment status in the central microservice
        repayment.status = status;
        await axios.put(`${BASE_URL}/loan-repayments/${repaymentId}`, repayment);

        // Update credit score based on repayment status
        await updateCreditScoreOnRepayment(repayment.userId, status, amount);

        res.json({ message: 'Repayment processed and credit score updated.' });
    } catch (error) {
        res.status(500).json({ message: error.response?.data || error.message });
    }
};

// Make a payment with Stripe
exports.makePayment = async (req, res) => {
    try {
        const { amount, paymentMethodId } = req.body;

        // Validate required inputs
        if (!amount || !paymentMethodId) {
            return res.status(400).json({ error: 'Amount and paymentMethodId are required' });
        }

        // Create a Stripe payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'pkr',
            payment_method: paymentMethodId,
            confirmation_method: 'automatic',
            confirm: true,
        });

        // Determine payment status
        const paymentStatus =
            paymentIntent.status === 'succeeded' ? 'completed' :
            paymentIntent.status === 'pending' ? 'pending' : 'failed';

        // Record payment in the central microservice
        const paymentResponse = await axios.post(`${BASE_URL}/payments`, {
            transactionId: paymentIntent.id,
            amount: paymentIntent.amount_received / 100,
            paymentMethod: paymentIntent.payment_method,
            paymentStatus,
            paymentDate: new Date(),
        });

        res.status(200).json({
            status: 'success',
            data: paymentResponse.data,
            message: 'Payment successful',
        });
    } catch (error) {
        console.error('Error during payment:', error);
        res.status(500).json({
            status: 'error',
            message: 'Payment failed',
            error: error.message,
        });
    }
};
