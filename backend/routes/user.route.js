const express = require("express");
const { updateUser, deleteUser, getUsers, uploadAvatar, downloadAvatar} = require("../controllers/user.controller");
const verifyUserAuthenticationToken = require("../utils/verifyUserAuthenticationToken");

const router = express.Router();

router.patch("/:id", verifyUserAuthenticationToken, updateUser)
      .delete("/:id", verifyUserAuthenticationToken, deleteUser)
      .post("/upload/avatar", uploadAvatar)
      .get("/download/avatar/:id", downloadAvatar)
      .get("/all", getUsers);

module.exports = router;