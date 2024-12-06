const LoanRepaymentMonitoring = require('../models/LoanRepaymentMonitoring');
const LoanApplication = require('../models/LoanApplication');

const sendRepaymentReminder = async () => {
  try {
    // fetch overdue repayments with status pending
    const overdueRepayments = await LoanRepaymentMonitoring.find({
      repaymentDate: { $lt: new Date() },
      status: 'pending'
    });
    if (overdueRepayments.length === 0) {
      return res.status(200).json({ message: 'No overdue repayments found.' });
    }
    for (const repayment of overdueRepayments) {
      // find the associated loan
      const loan = await LoanApplication.findById(repayment.loanId);
      if (loan) {
        console.log(`Loan ID: ${loan.applicationId}, Amount Due: ${repayment.remainingBalance}`);
        res.status(200).json({
          message: `Your repayment for Loan ID ${loan.applicationId} is overdue. Amount due: ${repayment.remainingBalance}`,
          loanId: loan.applicationId,
          amountDue: repayment.remainingBalance
        });
      }
    }
  } catch (error) {
    console.error('Error in sending notifications:', error.message);
    res.status(500).json({ error: 'Failed to send reminders' });
  }
};

module.exports = sendRepaymentReminder;