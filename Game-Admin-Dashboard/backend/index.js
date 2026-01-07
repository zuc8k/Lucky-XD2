require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// ================== CONFIG ==================
app.use(cors());
app.use(express.json());

// ================== DB ==================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Dashboard DB Connected"))
  .catch(err => console.error(err));

// ================== DASHBOARD ROUTES ==================
app.use("/dashboard", require("./routes/dashboard.router"));

// ================== START ==================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🖥️ Dashboard running on port ${PORT}`);
});