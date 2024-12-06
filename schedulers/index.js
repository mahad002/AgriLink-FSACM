const cron = require('node-cron');
const monitorRepayments = require('./monitorRepayments');
const sendRepaymentReminder = require('./sendNotifications');

// Schedule monitoring overdue repayments daily at midnight
cron.schedule('0 0 * * *', () => {
  console.log('Running daily repayment monitoring...');
  monitorRepayments();
});

// Schedule sending reminders daily at 8 AM
cron.schedule('0 8 * * *', () => {
  console.log('Sending repayment reminders...');
  sendRepaymentReminder();
});
