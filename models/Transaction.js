const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const transactionSchema = new mongoose.Schema({
    transactionId: { type: String, default: uuidv4 },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    transactionDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'completed', 'canceled'], default: 'pending', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
