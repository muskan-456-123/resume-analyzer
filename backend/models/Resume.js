const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    resumeText: { type: String, required: true },
    atsScore: { type: Number, required: true },
    skillsFound: [{ type: String }],
    missingSkills: [{ type: String }],
    recommendedRoles: [
      {
        role: String,
        match: Number,
      },
    ],
    improvementSuggestions: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.models.Resume || mongoose.model("Resume", ResumeSchema);
