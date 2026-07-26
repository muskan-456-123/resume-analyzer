require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    service: "Scanline Backend API",
    timestamp: new Date().toISOString() 
  });
});

app.use("/api/resumes", resumeRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => console.log(`🚀 Backend API running on http://localhost:${PORT}`));
  }
});

module.exports = app;
