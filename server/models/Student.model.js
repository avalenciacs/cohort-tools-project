const { Schema, model, Types } = require("mongoose");

const studentSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    linkedinUrl: String,
    languages: [String],
    program: String,
    background: String,
    image: String,
    projects: [{ type: Schema.Types.Mixed }],
    cohort: { type: Types.ObjectId, ref: "Cohort", required: true },
  },
  { timestamps: true }
);

module.exports = model("Student", studentSchema);
