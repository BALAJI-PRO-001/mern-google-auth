const express = require("express");
const { signUp, signIn, google, signOut, forgotPassword, resetPassword} = require("../controllers/auth.controller");
const router = express.Router();

router.post("/sign-up", signUp)
      .post("/sign-in", signIn)
      .post("/google", google)
      .get("/sign-out", signOut)
      .post("/forgot-password", forgotPassword)
      .post("/reset-password", resetPassword);

module.exports = router;