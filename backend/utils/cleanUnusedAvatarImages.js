const User = require("../db/mongodb/models/user.model");
const path = require("path");
const fs = require("fs/promises");


async function cleanUnusedAvatarImages() {
  try {
    const uploadDIR = path.join(__dirname, "../uploads");
    const avatarFiles = await fs.readdir(uploadDIR);
    const users = await User.find({});  
    const prefixes = users.map((user) => {
      return user.avatar.split("avatar/")[1];
    }).filter(Boolean);
    
    const unUsedAvatarFiles = avatarFiles.filter((avatarFile) => {
      return !prefixes.some(prefix => avatarFile.includes(prefix));
    });

    for (let unUsedAvatarFile of unUsedAvatarFiles) {
      await fs.unlink(path.join(uploadDIR, unUsedAvatarFile));
    }
  } catch(err) { 
    console.log(err.message);
  }
}

module.exports = cleanUnusedAvatarImages;
