const Admin = require("../db/mongodb/models/admin.model");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const errorHandler = require("../utils/errorHandler");
const { getUsers } = require("../controllers/user.controller");
const User = require("../db/mongodb/models/user.model");

async function createAdminAccount() {
  try {
    const hashedPassword = bcryptjs.hashSync("Admin@1234", 10);
    new Admin({
      email: "admin@gmail.com",
      password: hashedPassword
    }).save();
  } catch(err) {
    console.error("Error: " + err.message);
  }  
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({email: email.toLowerCase()});
    if (!admin) return next(errorHandler(404, "Admin not found"));
    const isValidPassword = bcryptjs.compareSync(password, admin.password);
    if (!isValidPassword) return next(errorHandler(401, "Unauthorized"))
    
    const accessToken = jwt.sign({id: admin.id}, process.env.JWT_SECRET_KEY);
    res.status(200).cookie("admin_access_token", accessToken, {httpOnly: true}).json({
      success: true,
      message: "Admin login successfully"
    });
  } catch(err) {
    next(err);
  }
}


async function blockUser(req, res, next) {
  try {
    const updatedUser = await User.findByIdAndUpdate({_id: req.params.id}, {
      isBlocked: req.body.blocked
    }, {new: true});
    const { password:_, ...rest } = updatedUser._doc;
    res.status(200).json({
      success: true,
      data: {
        user: rest
      }
    });
  } catch(err) {
    next(err);
  }
}


async function unBlockUser(req, res, next) {
  try {
    const updatedUser = await User.findByIdAndUpdate({_id: req.params.id}, {
      isBlocked: req.body.blocked
    }, {new: true});
    const { password:_, ...rest} = updatedUser._doc;
    res.status(200).json({
      success: true,
      data: {
        user: rest
      }
    });
  } catch(err) {
    next(err);
  }
}


async function logout(req, res, next) {
  try {
    res.status(200).clearCookie("admin_access_token").json({
      success: true,
      message: "Admin has been logged out"
    });
  } catch(err) {
    next(err);
  }
}


async function sendUsers(req, res, next) {
  getUsers(req, res, next);
}

async function deleteUser(req, res, next) {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).json({});
  } catch(err) {
    next(err);
  }
}



module.exports = {
  login, sendUsers, deleteUser, logout, blockUser, unBlockUser
};