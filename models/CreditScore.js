const mongoose = require('mongoose');

const CreditScoreSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  score: { 
    type: Number, 
    default: 500, 
    min: 300,     
    max: 900      
  },
  history: [
    {
      type: { 
        type: String, 
        enum: ['Loan', 'Repayment'], 
        required: true 
      },
      amount: { 
        type: Number, 
        required: true 
      },
      date: { 
        type: Date, 
        default: Date.now 
      },
      status: { 
        type: String, 
        enum: ['On-time', 'Late', 'Missed'], 
        required: true 
      }
    }
  ],
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

CreditScoreSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('CreditScore', CreditScoreSchema);
