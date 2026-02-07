const express = require("express");
const router = express.Router();
const { auth, db } = require("../firebaseAdmin");

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await auth.createUser({ email, password });

    await db.collection("users").doc(user.uid).set({
      name,
      email,
      role: "user",
      totalXP: 0,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "User created successfully",
      uid: user.uid,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
