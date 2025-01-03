// const { Router } = require("express");
// const router = Router();
// const encrypter = require("bcrypt");
// const auth_middleware = require("../middleware/user_auth.js");
// const loginThresholdMiddleware=require("../middleware/loginThresholdMiddleware.js")
// const { User } = require("../db/index.js");
// const jwt = require("jsonwebtoken");
// jwt_pass = "B374A26A71490437AA024E4FADD5B497FDFF1A8EA6FF12F6FB65AF2720B59CCF";


// const encryption_rounds = 10;

// //login part
// router.post('/signin', loginThresholdMiddleware,async (req, res) => {
//     const {email, password } = req.headers;

//     try {
//         const user = req.user; // From loginThresholdMiddleware

//         // Verify password
//         const isMatch = await encrypter.compare(password, user.password);
//         if (!isMatch) {
//             await user.incrementLoginAttempts();
//             return res.status(401).json({ message: "Invalid credentials" });
//         }

//         // Successful login - reset attempts
//         await user.resetLoginAttempts();

//         // Generate token
//         const token = jwt.sign({ email: user.email, id: user._id }, jwt_pass, {
//             expiresIn: "1h",
//         });

//         res.status(202).json({ msg: "Login successful", token: `Bearer ${token}` });
//     } catch (error) {
//         console.error("Signin Error:", error.message);
//         res.status(500).json({ message: "Internal server error" });
//     }
// });

// router.post("/signup", async (req, res) => {
//     const email = req.headers.email;
//     const password = req.headers.password;

//     let hashed_pass;
//     try {
//         hashed_pass = await encrypter.hash(password, encryption_rounds);
//     } catch (err) {
//         res.status(500).json({ msg: "Error hashing password" });
//         console.log(err); 
//     }

//     if (!hashed_pass) {
//         res.status(400).json({
//             msg: "Something went wrong"
//         })
//     }
//     try {
//         const user = await new User({
//             email: email,
//             password: hashed_pass
//         });
//         user.save();
//         const token = jwt.sign(email, jwt_pass);
//         res.status(201).json({
//             token: "Bearer " + token
//         });
//     } catch (err) {
//         console.log(err);
//         res.status(400).json({
//             msg: "Something went wrong",
//         });
//     }
// })

// module.exports= router;



const { Router } = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth_middleware = require("../middleware/user_auth.js");
const loginThresholdMiddleware = require("../middleware/loginThresholdMiddleware.js");
const { User } = require("../db/index.js");

const jwt_pass = "B374A26A71490437AA024E4FADD5B497FDFF1A8EA6FF12F6FB65AF2720B59CCF";
const encryption_rounds = 10;


//SIGNUP ROUTE

router.post("/signup", async (req, res) => {
    console.log('hi form signup route');
    
    const { 
        firstName, 
        middleName, 
        lastName, 
        mobile_no, 
        email, 
        password, 
        DOB
    } = req.body;

    if (!firstName || !lastName || !mobile_no || !email || !password || !DOB) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Hash password
        const hashed_pass = await bcrypt.hash(password, encryption_rounds);

        const user = new User({
            firstName,
            middleName,
            lastName,
            mobile_no,
            email,
            password: hashed_pass,
            DOB
        });

        await user.save();

        // Generate token expires in 1hr needs to be saved locally
        const token = jwt.sign({ email: user.email, id: user._id }, jwt_pass, {
            expiresIn: "1h"
        });

        res.status(201).json({ message: "Signup successful", token: `Bearer ${token}` });
    } catch (err) {
        console.error("Signup Error:", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
});


// SIGNIN ROUTE

router.post('/signin', loginThresholdMiddleware, async (req, res) => {
    const { Email, password } = req.body;

    if (!Email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = req.user; // From loginThresholdMiddleware

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            await user.incrementLoginAttempts();
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Successful login - reset attempts
        await user.resetLoginAttempts();

        // Generate token
        const token = jwt.sign({ email: user.email, id: user._id }, jwt_pass, {
            expiresIn: "1h"
        });

        res.status(202).json({ message: "Login successful", token: `Bearer ${token}` });
    } catch (error) {
        console.error("Signin Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
    console.log('Hi signin successful');
    
});


module.exports = router;

