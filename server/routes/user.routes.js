const router = require("express").Router();
const User = require("../models/User.model");
const isAuthenticated = require("../middleware/isAuthenticated");

// 🔒 GET TODOS LOS USUARIOS (opcional, recomendado)
router.get("/users", isAuthenticated, async (req, res, next) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

// 🔒 GET /api/users/:id (OBLIGATORIA EN DÍA 5)
router.get("/users/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
