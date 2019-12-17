const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  if (!process.env.REQUIRE_AUTH) return next();
  const token = res.header("x-auth-token");
  if (!token) return res.status(400).send("Access denied.No token provided!");
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(404).send("Invalid token");
  }
};
