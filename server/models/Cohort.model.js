const { Schema, model } = require("mongoose");

const cohortSchema = new Schema(
  {
    inProgress: Boolean,
    cohortSlug: { type: String, required: true, unique: true },
    cohortName: { type: String, required: true },
    program: { type: String, required: true },
    format: String,
    campus: { type: String, required: true },
    startDate: Date,
    endDate: Date,
    programManager: String,
    leadTeacher: String,
    totalHours: Number,
  },
  { timestamps: true }
);

module.exports = model("Cohort", cohortSchema);
