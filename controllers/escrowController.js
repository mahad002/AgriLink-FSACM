const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.DB_SERVICE_URL;

// Create an escrow transaction
exports.createEscrow = async (req, res) => {
    try {
        const { transactionId, amount, paymentMethod } = req.body;

        const response = await axios.post(`${BASE_URL}/payments`, {
            transactionId,
            amount,
            paymentMethod,
            paymentStatus: 'pending',
            paymentDate: new Date(),
            escrow: true,
            escrowStatus: 'Pending',
            escrowReleaseConditions: {
                allPartiesConfirmed: false,
                transactionVerified: false,
            },
        });

        res.status(201).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            error: error.response?.data || 'Error creating escrow transaction',
        });
    }
};

// Verify escrow conditions
exports.verifyEscrowConditions = async (req, res) => {
    try {
        const { transactionId, conditionType } = req.body;

        const response = await axios.get(`${BASE_URL}/payments/${transactionId}`);
        const payment = response.data?.data;

        if (!payment || payment.escrowStatus !== 'Pending') {
            return res.status(404).json({ error: 'Transaction not found or not in escrow' });
        }

        if (conditionType === 'allPartiesConfirmed') {
            payment.escrowReleaseConditions.allPartiesConfirmed = true;
        } else if (conditionType === 'transactionVerified') {
            payment.escrowReleaseConditions.transactionVerified = true;
        }

        const updatedResponse = await axios.put(`${BASE_URL}/payments/${transactionId}`, payment);

        res.status(200).json(updatedResponse.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            error: error.response?.data || 'Error verifying escrow conditions',
        });
    }
};

// Release escrow funds
exports.releaseEscrowFunds = async (req, res) => {
    try {
        const { transactionId } = req.params;

        const response = await axios.get(`${BASE_URL}/payments/${transactionId}`);
        const payment = response.data?.data;

        if (!payment) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        if (payment.escrowStatus === 'Released') {
            return res.status(400).json({ error: 'Funds already released' });
        }

        if (
            payment.escrowReleaseConditions.allPartiesConfirmed &&
            payment.escrowReleaseConditions.transactionVerified
        ) {
            payment.escrow = false;
            payment.escrowStatus = 'Released';

            const updatedResponse = await axios.put(`${BASE_URL}/payments/${transactionId}`, payment);

            res.status(200).json({
                message: 'Funds released successfully',
                payment: updatedResponse.data,
            });
        } else {
            res.status(400).json({ error: 'Escrow conditions not met' });
        }
    } catch (error) {
        res.status(error.response?.status || 500).json({
            error: error.response?.data || 'Error releasing funds',
        });
    }
};

// Fetch escrow details
exports.getEscrowDetails = async (req, res) => {
    try {
        const { transactionId } = req.params;

        const response = await axios.get(`${BASE_URL}/payments/${transactionId}`);
        const payment = response.data?.data;

        if (!payment) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        const escrowDetails = {
            transactionId: payment.transactionId,
            amount: payment.amount,
            escrowStatus: payment.escrowStatus,
            escrowReleaseConditions: payment.escrowReleaseConditions,
        };

        res.status(200).json(escrowDetails);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            error: error.response?.data || 'Error fetching escrow details',
        });
    }
};
