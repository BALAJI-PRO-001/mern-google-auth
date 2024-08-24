const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_URL);
    console.log("MongoDB database connected!");
    console.log("Connected to database:", mongoose.connection.db.databaseName.toUpperCase());
  } catch (err) {
    console.log("Error connecting to MongoDB:", err.message);
  }
}

module.exports = {
  connect
};
