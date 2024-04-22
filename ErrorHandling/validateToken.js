require("dotenv").config();
const asyncHandler = require("express-async-handler");

// Importing the JSONWEBTOKEN
const jwt = require("jsonwebtoken");

// It is a middleware function that will check the token validity
const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];

    try {
      console.log("Token:", token);
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log("Decoded:", decoded);
      req.user = decoded.user; // Assuming user information is stored in the token payload
      next();
    } catch (error) {
      console.error("Error verifying token:", error);
      res.status(401);
      throw new Error("User is not authorized");
    }
  } else {
    res.status(401);
    throw new Error("Authorization header is missing or malformed");
  }
});

module.exports = validateToken;
