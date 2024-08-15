const axios = require('axios');
const Payment = require('../models/paymentModel'); // Assuming you have a Payment model defined

const processPayment = async (req, res) => {
    try {
        const { amount, email, phoneNo } = req.body;

        // Customize your API key here (use test or live secret key based on your environment)
        const khaltiApiKey = 'test_secret_key_0955faee90324c3b81519dcab0757680';

        // Customize payment initiation data
        const paymentData = {
            amount: Math.round(amount * 100), // Convert amount to paisa (assuming amount is in rupees)
            email: email,
            phone: phoneNo,
            productIdentity: '123456', // Example product identity
            productName: 'Test Product', // Example product name
        };

        // Configure request headers
        const config = {
            headers: {
                Authorization: "test_public_key_c4c8b667b30d494899c286d97bd378d3",
                'Content-Type': 'application/json',
            },
        };

        // Send payment initiation request to Khalti
        const response = await axios.post('https://a.khalti.com/api/v2/epayment/initiate/', paymentData, config);

        // Handle the response from the payment provider
        res.status(200).json({ message: 'Payment initiated successfully', response: response.data });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ error: 'Failed to process payment' });
    }
};

const KhaltiResponse = (req, res) => {
    // Implement logic to handle Khalti payment response/callback
    // This route will receive callbacks from Khalti after payment processing
    res.status(200).json({ message: 'Khalti payment response received' });
};

const getPaymentStatus = async (req, res) => {
    const orderId = req.params.id;

    try {
        const payment = await Payment.findOne({ orderId: orderId });

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        res.status(200).json({ paymentStatus: payment.status });
    } catch (error) {
        console.error('Error fetching payment status:', error);
        res.status(500).json({ error: 'Failed to fetch payment status' });
    }
};

module.exports = {
    processPayment,
    KhaltiResponse,
    getPaymentStatus,
};
