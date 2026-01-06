const { Schema, model, Types } = require("mongoose");

const studentSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },

    email: { type: String, required: true, trim: true },
    phone: { type: String },
    linkedinUrl: { type: String },

    languages: [{ type: String }],

    program: { type: String },
    background: { type: String },

    image: { type: String },

    projects: [{ type: Schema.Types.Mixed }], // en tu JSON es array vacío, así no rompe

    cohort: { type: Types.ObjectId, ref: "Cohort", required: true },
  },
  { timestamps: true }
);

module.exports = model("Student", studentSchema);