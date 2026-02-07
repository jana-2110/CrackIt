const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// 🔐 CONNECT AUTH ROUTES
app.use("/api/auth", authRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
