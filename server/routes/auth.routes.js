const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const User = require("../models/User.model");

const { isAuthenticated } = require("../middleware/jwt.middleware");

const saltRounds = 10;

// Regex del profe
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

//
// POST /auth/signup
//
router.post("/signup", async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // 1) Campos obligatorios
    if (!email || !password || !name) {
      return res.status(400).json({ message: "Provide email, password and name" });
    }

    // 2) Validación email
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Provide a valid email address." });
    }

    // 3) Validación password
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
      });
    }

    // 4) Email único
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // 5) Hash password (guardamos en passwordHash)
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);

    const createdUser = await User.create({
      email,
      name,
      passwordHash, // 👈 tu modelo
    });

    // 6) Respuesta sin hash
    const user = { _id: createdUser._id, email: createdUser.email, name: createdUser.name };
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
});

//
// POST /auth/login
//
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Campos obligatorios
    if (!email || !password) {
      return res.status(400).json({ message: "Provide email and password." });
    }

    // 2) Buscar usuario
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(401).json({ message: "User not found." });
    }

    // 3) Comparar password con hash guardado
    const passwordCorrect = await bcrypt.compare(password, foundUser.passwordHash);
    if (!passwordCorrect) {
      return res.status(401).json({ message: "Unable to authenticate the user" });
    }

    // 4) Payload (como el profe: _id, email, name)
    const payload = { _id: foundUser._id, email: foundUser.email, name: foundUser.name };

    // 5) Firmar token (como el profe: TOKEN_SECRET + 6h)
    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: process.env.TOKEN_EXPIRATION || "6h",
    });

    res.status(200).json({ authToken });
  } catch (err) {
    next(err);
  }
});

//
// GET /auth/verify
//
router.get("/verify", isAuthenticated, (req, res) => {
  // Si el token es válido, express-jwt deja el payload en req.payload
  res.status(200).json(req.payload);
});

module.exports = router;
