import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.js";

const router = express.Router();

/* =====================================
   REGISTER (USER + AUTHORITY)
===================================== */
router.post("/register", async (req, res) => {
  try {
    const {
      role,
      fullName,
      email,
      phone,
      password,
      location,
      idNumber,
      authorityRole
    } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: "All required fields missing" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: fullName,
      email,
      phone,
      password: hashed,
      role: role || "user",
      location,
      idNumber,
      authorityRole
    });

    await newUser.save();

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* =====================================
   LOGIN
===================================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    if (role && user.role !== role)
      return res.status(400).json({ message: "Incorrect role selected" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ message: "Invalid password" });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        authorityRole: user.authorityRole
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* =====================================
   DEBUG: GET ALL USERS
===================================== */
router.get("/", async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

export default router;