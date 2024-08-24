const express = require("express");
const { login, sendUsers, deleteUser, logout, blockUser, unBlockUser } = require("../controllers/admin.controller");
const verifyAdminAuthenticationToken = require("../utils/verifyAdminAuthenticationToken");

const router = express.Router();

router.post("/login", login)
      .get("/users", verifyAdminAuthenticationToken, sendUsers)
      .delete("/user/:id", verifyAdminAuthenticationToken, deleteUser)
      .get("/logout", logout) 
      .post("/user/block/:id", blockUser)
      .post("/user/un-block/:id", unBlockUser);

module.exports = router;