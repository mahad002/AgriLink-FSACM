const LoanRepaymentMonitoring = require('../models/LoanRepaymentMonitoring');
const LoanApplication = require('../models/LoanApplication');

const monitorRepayments = async () => {
  try {
    const overdueRepayments = await LoanRepaymentMonitoring.find({
      repaymentDate: { $lt: new Date() },
      status: 'pending'
    });

    for (const repayment of overdueRepayments) {
      repayment.status = 'failed';
      await repayment.save();

      const loan = await LoanApplication.findById(repayment.loanId);
      if (loan) {
        loan.status = 'overdue';
        await loan.save();
      }

      console.log(`Marked repayment ${repayment.monitoringId} as failed.`);
    }
  } catch (error) {
    console.error('Error in monitoring repayments:', error.message);
  }
};

module.exports = monitorRepayments;
