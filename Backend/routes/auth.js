const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required",
            });
        }

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({
                message: "Username already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            password: hashedPassword,
            role: "admin",
        });

        await user.save();

        res.status(201).json({
            message: "User registered successfully",
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: err.message,
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Check that username and password were provided
        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required",
            });
        }

        // 2. Find the user
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({
                message: "Invalid username or password",
            });
        }

        // 3. Compare the entered password with the hashed password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid username or password",
            });
        }

        // 4. Create JWT
        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        // 5. Send token to frontend
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
            },
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: err.message,
        });
    }
});

module.exports = router;