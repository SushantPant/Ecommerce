const express = require('express');
const router = express.Router();

// Import the controller for handling POST requests
const { processPayment } = require('../controllers/paymentController');

// Route for processing payments
router.post('/process-payment', processPayment);

module.exports = router;
