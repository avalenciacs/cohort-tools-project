const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const isAuthenticated = require("../middleware/isAuthenticated");

// POST /auth/signup
router.post("/signup", async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const createdUser = await User.create({
      email,
      passwordHash,
      name,
    });

    res.status(201).json({
      _id: createdUser._id,
      email: createdUser.email,
      name: createdUser.name,
    });
  } catch (err) {
    next(err);
  }
});

// POST /auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      userId: user._id,
      email: user.email,
    };

    const authToken = jwt.sign(payload, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: process.env.TOKEN_EXPIRATION || "1d",
    });

    res.status(200).json({ authToken });

  } catch (error) {
    next(error);
  }
});


// GET /auth/verify 
router.get("/verify", isAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findById(req.payload.userId).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
