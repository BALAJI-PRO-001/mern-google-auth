const User = require("../db/mongodb/models/user.model");

async function keepMongoDBActive() {
  try {
   await User.findOne();
  } catch(err) { 
    console.log(err.message);
  }
}

module.exports = keepMongoDBActive;
