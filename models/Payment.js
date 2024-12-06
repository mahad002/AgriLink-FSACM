const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const paymentSchema = new mongoose.Schema({
    paymentId: { type: String, default: uuidv4 },
    transactionId: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, required: true },
    paymentMethod: { type: String },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], required: true },
    escrow: { 
        type: Boolean, 
        default: true 
    },
    escrowStatus: {
        type: String,
        enum: ['Pending', 'Released', 'Cancelled'], 
        default: 'Pending' 
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    escrowReleaseConditions: {
        allPartiesConfirmed: { type: Boolean, default: false },
        transactionVerified: { type: Boolean, default: false }
    }
});

module.exports = mongoose.model('Payment', paymentSchema);
