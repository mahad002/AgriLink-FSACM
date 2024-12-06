const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.DB_SERVICE_URL;

// Create a new loan application
exports.createLoanApplication = async (req, res) => {
    try {
        const response = await axios.post(`${BASE_URL}/loan-applications`, req.body);
        res.status(201).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
    }
};

// Retrieve all loan applications
exports.getAllLoanApplications = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const response = await axios.get(`${BASE_URL}/loan-applications`, { params: { page, limit } });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
    }
};

// Retrieve a loan application by ID
exports.getLoanApplicationById = async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/loan-applications/${req.params.id}`);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
    }
};

// Update a loan application by ID
exports.updateLoanApplication = async (req, res) => {
    try {
        const response = await axios.put(`${BASE_URL}/loan-applications/${req.params.id}`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
    }
};

// Delete a loan application by ID
exports.deleteLoanApplication = async (req, res) => {
    try {
        const response = await axios.delete(`${BASE_URL}/loan-applications/${req.params.id}`);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
    }
};

// Approve or reject a loan application
exports.approveOrRejectLoan = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const response = await axios.put(`${BASE_URL}/loan-applications/${req.params.id}/status`, { status });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
    }
};
