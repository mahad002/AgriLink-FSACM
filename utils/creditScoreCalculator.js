const updateCreditScore = (creditScore, repaymentStatus, loanAmount) => {
    let change = 0;
  
    switch (repaymentStatus) {
      case 'On-time':
        change = Math.min(loanAmount * 0.01, 50); // Either increase the score by 1% of loan amount or 50 max
        break;
      case 'Late':
        change = -Math.min(loanAmount * 0.02, 30); // Either decrease the score by 2% of loan amount or 30 max
        break;
      case 'Missed':
        change = -Math.min(loanAmount * 0.05, 100); // Either decrease score by 5% of loan amount or max 100
        break;
    }
  
    creditScore.score = Math.max(300, Math.min(900, creditScore.score + change)); // keep score between 300 and 900
  
    creditScore.history.push({
      type: 'Repayment',
      amount: loanAmount,
      date: new Date(),
      status: repaymentStatus
    });
  
    creditScore.updatedAt = new Date();
  
    return creditScore;
};
  
module.exports = { updateCreditScore };
  