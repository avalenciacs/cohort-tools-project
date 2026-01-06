const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5005;
const mongoose = require("mongoose");
const Cohort = require("./models/Cohorts.model");
const Student = require("./models/Student.model");
// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...


// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();
const cors = require("cors");

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({origin: "http://localhost:5173" ,}));


// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
mongoose.connect("mongodb://localhost:27017/cohorts-tools-api")
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("Could not connect to MongoDB...", err));

app.get("/api/cohorts", async (req, res, next) => {
  try {
    const cohorts = await Cohort.find();
    res.json(cohorts);
  } catch (err) {
    next(err);
  }
});

app.get("/api/students", async (req, res, next) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    next(err);
  }
});
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});


// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});