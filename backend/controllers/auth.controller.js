const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const User = require("../db/mongodb/models/user.model");
const errorHandler = require("../utils/errorHandler");
const generatedOTP = require("../utils/generateOTP");
const sendOTPEmail = require("../config/nodemailerConfig");

async function signUp(req, res, next) {
  try {
    const { username, email, password, avatar } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = await new User({
      username: username,
      email: email.toLowerCase(),
      password: hashedPassword,
      avatar: avatar
    }).save();

    const { password:_, ...rest } = newUser._doc;
    res.status(201).json({
      success: true,
      data: {
        user: rest
      }
    });
  } catch(err) {
    if (err.message.includes("duplicate key"))
      return next(errorHandler(409, "Duplicate key"));
    next(err);
  }
}


async function signIn(req, res, next) {
  try {
    const { email, password } = req.body;
    const validUser = await User.findOne({email: email.toLowerCase()});
    if (!validUser) return next(errorHandler(404, "User not found"));

    if (validUser && validUser.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked"
      });
    }

    const isValidPassword = bcryptjs.compareSync(password, validUser.password);
    if (!isValidPassword) return next(errorHandler(401, "Unauthorized"));
    
    const accessToken = jwt.sign({id: validUser.id}, process.env.JWT_SECRET_KEY);
    const { password:_, ...rest } = validUser._doc;
    res.status(200).cookie("user_access_token", accessToken, {httpOnly: true}).json({
      success: true,
      data: {
        user: rest
      }
    });
  } catch(err) {
    next(err);
  }
}


async function google(req, res, next) {
  try {
    const { username, email, avatar } = req.body;
    const user = await User.findOne({email: email});

    if (user && user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked"
      });
    }
    

    if (user) {
      const accessToken = jwt.sign({id: user.id}, process.env.JWT_SECRET_KEY);
      const { password:_, ...rest } = user._doc;
      res.status(200).cookie("user_access_token", accessToken, {httpOnly: true}).json({
        success: true,
        data: {
          user: rest
        }
      });
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = await new User({
        username: username,
        email: email,
        password: hashedPassword,
        avatar: avatar
      }).save();

      const accessToken = jwt.sign({id: newUser.id}, process.env.JWT_SECRET_KEY);
      const { password:_, ...rest } = newUser._doc;
      res.status(201).cookie("access_token", accessToken, {httpOnly: true}).json({
        success: true,
        data: {
          user: rest
        }
      });
    }
  } catch(err) {
    next(err);
  }
}


async function signOut(req, res, next) {
  try {
    res.status(200).clearCookie("user_access_token").json({
      success: true,
      message: "User has been logged out"
    });
  } catch(err) {
    next(err);
  }
}


async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) return next(errorHandler(400, "Email is required"));
    
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(404, "User not found"));

    const otp = generatedOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // Set OTP expiry to 5 minutes
    await user.save();

    await sendOTPEmail(email, otp);
    res.status(200).json({
      success: true,
      message: "OTP has been sent successfully to email"
    });
  } catch (err) {
    next(err);
  }
}



async function resetPassword(req, res, next) {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) return next(errorHandler(400, "All fields are required"));

  try {
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(404, "User not found"));

    if (Date.now() > user.otpExpires) return next(errorHandler(400, "OTP expired"));
    if (otp !== user.otp) return next(errorHandler(400, "Invalid OTP"));

    const hashedPassword = bcryptjs.hashSync(newPassword, 10);
    user.password = hashedPassword;
    user.otp = undefined;  
    user.otpExpires = undefined; 

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully"
    });
  } catch (err) {
    next(err);
  }
}



module.exports = {
  signUp,
  signIn,
  google,
  signOut,
  forgotPassword, 
  resetPassword,
};