const nodemailer = require("nodemailer");
const { User } = require("../db/index.js");

// Configure nodemailer for sending email alerts
const transporter = nodemailer.createTransport({
    service: "gmail",
    secure:true,
    host:"smtp.gmail.com",
    auth: {
        user: "your-mail@gmail.com",
        pass: "XXXX"
    }
});

// Middleware to enforce login attempt thresholds
async function loginThresholdMiddleware(req, res, next) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Check if account is locked
        if (user.lockUntil && user.lockUntil > Date.now()) {
            return res.status(403).json({
                message: "Account is locked due to multiple failed login attempts. Please try again later."
            });
        }

        // Track failed login attempts for 3 attempts
        if (user.loginAttempts === 3) {
            
            await transporter.sendMail({
                from: "your-mail@gmail.com",
                to: user.email,
                subject: "⚠️ Suspicious Login Attempts Detected",
                text: `We've noticed 3 failed login attempts on your account. If this wasn't you, please reset your password immediately.`
            });
        }

        // Attach user object to request for further use in signin route
        req.user = user;

        next();
    } catch (error) {
        console.error("Login Threshold Middleware Error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = loginThresholdMiddleware;
