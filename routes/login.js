import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import bcrypt from "bcrypt"; 
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

//! Login route
router.post("/login", async (req, res) => { 
  const { username, password } = req.body;

  try {

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password); 
    
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ success: true, message: "Login successful", token: token });

  } catch (error) {
    console.error("Error during login:", error);

    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;