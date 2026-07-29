import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

/**
 * Express middleware that verifies the JWT token from cookies
 * and validates the requesting user's identity.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function authenticateToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    console.log("⛔ No token provided");
    return res
      .status(401)
      .json({ message: "Access Denied: No token provided" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    const authenticatedUser = await User.findOne({
      username: req.body.username,
    });

    if (authenticatedUser) {
      if (authenticatedUser._id != user.userId) {
        console.log("⚠️ Warning: Unauthorized Access Attempted!");
        return res
          .status(401)
          .json({ message: "Access Denied: Unauthorized access attempted" });
      }
    }

    req.user = user;
    next();
  });
}

export default authenticateToken;
