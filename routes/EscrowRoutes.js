const express = require('express');
const escrowServiceController = require('../controllers/escrowServiceController');
const router = express.Router();

router.post('/escrow/create', escrowServiceController.createEscrow);
router.put('/escrow/verify', escrowServiceController.verifyEscrowConditions);
router.put('/escrow/:transactionId/release', escrowServiceController.releaseEscrowFunds);
router.get('/escrow/:transactionId', escrowServiceController.getEscrowDetails);

module.exports = router;
