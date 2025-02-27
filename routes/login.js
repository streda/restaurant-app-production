import express from "express"; 
import jwt from "jsonwebtoken"; 
import User from "../models/userModel.js"; 
import dotenv from "dotenv"; 

dotenv.config();

const router = express.Router();

// Login route
router.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user in database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ success: true, token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;