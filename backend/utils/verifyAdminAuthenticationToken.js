const jwt = require("jsonwebtoken");
const errorHandler = require("./errorHandler");


function verifyAdminAuthenticationToken(req, res, next) {
  const accessToken = req.cookies.admin_access_token;
  if (!accessToken) return next(errorHandler(401, "Unauthorized"));
  jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) return next(errorHandler(403, "Forbidden"));
    req.verifiedUserId = decoded.id;
    next();
  });
}

module.exports = verifyAdminAuthenticationToken;