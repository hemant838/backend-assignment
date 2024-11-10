import bcrypt from "bcryptjs";
const { compare } = bcrypt;

import jwt from "jsonwebtoken";
const { sign } = jwt;

import User from "../models/User.js";

// Register
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email }); // Use User.findOne directly
        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }

        user = new User({
            name,
            email,
            password,
        });

        await user.save();

        const payload = { userId: user._id };
        const token = sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(201).json({ token });
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};


export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email }); 
        if (!user) return res.status(400).json({ msg: "Invalid credentials" });

        const isMatch = await compare(password, user.password); 
        if (!isMatch)
            return res.status(400).json({ msg: "Invalid credentials" });

        const payload = { userId: user._id };
        const token = sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ token });
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};
