const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const PORT = 5005;

const mongoose = require("mongoose");

// IMPORT MOCK DATA AND MODELS
const Cohort = require("./models/Cohort.model");
const Student = require("./models/Student.model");


// INITIALIZE EXPRESS APP
const app = express();

// MIDDLEWARE
app.use(cors({ origin: "http://localhost:5173" }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));


mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));
// ROUTES

// GET /docs → HTML documentation
app.get("/docs", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "docs.html"));
});

//
//COHORTS ROUTES
// GET /api/cohorts 

app.get("/api/cohorts", async (req, res, next) => {
  try {
    const cohorts = await Cohort.find();
    res.json(cohorts);
  } catch (err) {
    next(err);
  }
});
//POST /api/cohorts
app.post("/api/cohorts", async (req, res, next) => {
  try {
    const created = await Cohort.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

//GET /api/cohorts/:cohortId
app.get("/api/cohorts/:cohortId", async (req, res, next) => {
  try {
    const { cohortId } = req.params;
    const cohort = await Cohort.findById(cohortId);
    if (!cohort) return res.status(404).json({ message: "Cohort not found" });
    res.json(cohort);
  } catch (err) {
    next(err);
  }
});
//PUT /api/cohorts/:cohortId
app.put("/api/cohorts/:cohortId", async (req, res, next) => {
  try {
    const { cohortId } = req.params;
    const updated = await Cohort.findByIdAndUpdate(cohortId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Cohort not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});
//DELETE /api/cohorts/:cohortId
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
//STUDENTS ROUTES
// GET /api/students 

app.get("/api/students", async (req, res, next) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    next(err);
  }
});

//POST /api/students
app.post("/api/students", async (req, res, next) => {
  try {
    const created = await Student.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

//GET /api/students/:studentId
app.get("/api/students/:studentId", async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId).populate("cohort");
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    next(err);
  }
});

//GET /api/students/cohort/:cohortId (filtrar por cohort)
app.get("/api/students/cohort/:cohortId", async (req, res, next) => {
  try {
    const { cohortId } = req.params;
    const students = await Student.find({ cohort: cohortId }).populate("cohort");
    res.json(students);
  } catch (err) {
    next(err);
  }
});

//PUT /api/students/:studentId
app.put("/api/students/:studentId", async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const updated = await Student.findByIdAndUpdate(studentId, req.body, {
      new: true,
      runValidators: true,
    }).populate("cohort");

    if (!updated) return res.status(404).json({ message: "Student not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});
//DELETE /api/students/:studentId
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




// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
