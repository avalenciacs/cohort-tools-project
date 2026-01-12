const { Schema, model } = require("mongoose");

const cohortSchema = new Schema(
  {
    inProgress: { type: Boolean, default: false },

    cohortSlug: { type: String, required: true, unique: true, trim: true },
    cohortName: { type: String, required: true, trim: true },

    program: { type: String, required: true },
    format: { type: String },          
    campus: { type: String, required: true },

    startDate: { type: Date },
    endDate: { type: Date },

    programManager: { type: String },
    leadTeacher: { type: String },

    totalHours: { type: Number },
  },
  { timestamps: true }
);

module.exports = model("Cohort", cohortSchema);