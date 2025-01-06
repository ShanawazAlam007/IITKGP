const { User_details } = require('../db/index.js');
const express = require('express');
const router = express.Router();


// Route to handle sending money
router.post('/transaction', async (req, res) => {
    try {
        const { senderId, receiverId, amount } = req.body;

        const numericAmount = Number(amount);

        if (isNaN(numericAmount) || numericAmount <= 0) {
            throw new Error("Invalid amount. Please provide a valid number greater than zero.");
        }

        const result = await User_details.sendMoney(senderId, receiverId, numericAmount);

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;


