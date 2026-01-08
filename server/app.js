require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const PORT = 5005;

// MODELS
const Cohort = require("./models/Cohort.model");
const Student = require("./models/Student.model");

// NEW (Day 5)
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const app = express();

// MIDDLEWARE
app.use(cors({ origin: "http://localhost:5173" })); // solo una vez
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// DB
mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ROUTES
app.get("/docs", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "docs.html"));
});

// NEW (Day 5)
app.use("/auth", authRoutes);
app.use("/api", userRoutes);

//
// COHORTS ROUTES
//
app.get("/api/cohorts", async (req, res, next) => {
  try {
    const cohorts = await Cohort.find();
    res.status(200).json(cohorts);
  } catch (err) {
    next(err);
  }
});

app.post("/api/cohorts", async (req, res, next) => {
  try {
    const created = await Cohort.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

app.get("/api/cohorts/:cohortId", async (req, res, next) => {
  try {
    const { cohortId } = req.params;
    const cohort = await Cohort.findById(cohortId);
    if (!cohort) return res.status(404).json({ message: "Cohort not found" });
    res.status(200).json(cohort);
  } catch (err) {
    next(err);
  }
});

app.put("/api/cohorts/:cohortId", async (req, res, next) => {
  try {
    const { cohortId } = req.params;

    const updated = await Cohort.findByIdAndUpdate(cohortId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: "Cohort not found" });

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
});

app.delete("/api/cohorts/:cohortId", async (req, res, next) => {
  try {
    const { cohortId } = req.params;
    const deleted = await Cohort.findByIdAndDelete(cohortId);
    if (!deleted) return res.status(404).json({ message: "Cohort not found" });
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

//
// STUDENTS ROUTES
//
app.get("/api/students", async (req, res, next) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    next(err);
  }
});

app.post("/api/students", async (req, res, next) => {
  try {
    const created = await Student.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

app.get("/api/students/:studentId", async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId).populate("cohort");
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json(student);
  } catch (err) {
    next(err);
  }
});

app.get("/api/students/cohort/:cohortId", async (req, res, next) => {
  try {
    const { cohortId } = req.params;
    const students = await Student.find({ cohort: cohortId }).populate("cohort");
    res.status(200).json(students);
  } catch (err) {
    next(err);
  }
});

app.put("/api/students/:studentId", async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const updated = await Student.findByIdAndUpdate(studentId, req.body, {
      new: true,
      runValidators: true,
    }).populate("cohort");

    if (!updated) return res.status(404).json({ message: "Student not found" });
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
});

app.delete("/api/students/:studentId", async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const deleted = await Student.findByIdAndDelete(studentId);
    if (!deleted) return res.status(404).json({ message: "Student not found" });
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

// ERROR HANDLER (mejorado para JWT)
app.use((error, req, res, next) => {
  console.error(error);

  if (error.name === "UnauthorizedError") {
    return res.status(401).json({ message: "Invalid or missing token" });
  }

  res.status(500).json({ message: "Internal Server Error" });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
