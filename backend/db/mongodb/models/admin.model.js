const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Number
  }
}, {
  timestamps: true
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;