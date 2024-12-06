const express = require('express');
const router = express.Router();
const monitorRepayments = require('../schedulers/monitorRepayments');
const sendRepaymentReminder = require('../schedulers/sendNotifications');

// Route to test repayment monitoring
router.get('/test-monitor-repayments', async (req, res) => {
  try {
    await monitorRepayments();
    res.send('Repayment monitoring executed successfully.');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route to test sending repayment reminders
router.get('/test-send-reminders', async (req, res) => {
  try {
    await sendRepaymentReminder();
    res.send('Repayment reminders sent successfully.');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
