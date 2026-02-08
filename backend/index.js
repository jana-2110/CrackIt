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

// Serve static files from the React app
const path = require("path");
app.use(express.static(path.join(__dirname, "client/dist")));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
