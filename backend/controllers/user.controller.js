const bcryptjs = require("bcryptjs");
const errorHandler = require("../utils/errorHandler");
const User = require("../db/mongodb/models/user.model");
const upload = require("../config/storageConfig");
const path = require("path");
const fs = require("fs/promises");


async function getUsers(req, res, next) {
  try {
    const users = await User.find({});
    const extractedUsers = [];
    for (let user of users) {
      const { password:_, ...extractedUser } = user._doc;
      extractedUsers.push(extractedUser);
    }
    res.status(200).json({
      success: true,
      count: extractedUsers.length,
      data: {
        users: extractedUsers
      }
    });
  } catch(err) {
    next(err);
  }
}



async function updateUser(req, res, next) {
  if (req.verifiedUserId != req.params.id) return next(errorHandler(401, "Unauthorized"));
  if (req.body.id || req.body._id) return next(errorHandler(400, "Cannot update id"));

  try {
    const userToUpdate = await User.findById(req.params.id);
    if (!userToUpdate) return next(errorHandler(404, "User not found"));
    if (req.body.password) req.body.password = bcryptjs.hashSync(req.body.password, 10);

    const updatedUser = await User.findByIdAndUpdate({_id: req.params.id}, {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      avatar: req.body.avatar
    }, {new: true});

    const { password:_, ...rest } = updatedUser._doc;
    res.status(200).json({
      success: true,
      data: {
        user: rest
      }
    });
  } catch(err) {
    next(errorHandler(409, "Duplicate Key"));
  }
}


async function deleteUser(req, res, next) {
  if (req.verifiedUserId != req.params.id) return next(errorHandler(401, "Unauthorized"));
  
  try {
    const { email, password } = req.body;
    const userToDelete = await User.findOne({email: email});
    if (!userToDelete) return next(errorHandler(404, "User not found"));
    const isValidPassword = bcryptjs.compareSync(password, userToDelete.password);
    if (!isValidPassword) return next(errorHandler(401, "Unauthorized"));

    await User.findByIdAndDelete(req.params.id);
    res.status(204).json({});
  } catch(err) {
    next(err);
  }
}



async function uploadAvatar(req, res, next) {
  upload(req, res, (err) => {
    if (err) return next(errorHandler(500, err.message));
    if (req.file == undefined) return next(errorHandler(400, "No File Selected"));

    const { originalname, filename} = req.file;
    const downloadURL = `${process.env.PROTOCOL || "http"}://${process.env.HOST || "localhost"}:${process.env.PORT || 3000}/api/v1/user/download/avatar/${filename.split("-")[0]}`;
    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      file: {
        originalname: originalname,
        downloadURL: downloadURL
      }
    });
  });
} 


async function downloadAvatar(req, res, next) {
  console.log(req.params.id);
  try {
    const avatarFilesDirPath = path.join(__dirname, "../uploads");
    const fileNames = await fs.readdir(avatarFilesDirPath);

    for (let fileName of fileNames) {
      if (fileName.includes(req.params.id)) {
        console.log(path.join(avatarFilesDirPath, fileName));
        return res.status(200).sendFile(path.join(avatarFilesDirPath, fileName));
      }
    }

    return next(errorHandler(404, "File not found"));
  } catch(err) {
    next(err);
  }
} 



module.exports = {
  updateUser,
  deleteUser,
  uploadAvatar,
  downloadAvatar,
  getUsers,
};