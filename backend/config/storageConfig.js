const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads"),
  filename: function(req, file, callback) {
    const fileName = `${Date.now()}-${file.originalname}`;
    callback(null, fileName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 2 }
}).single("avatar");


module.exports = upload;