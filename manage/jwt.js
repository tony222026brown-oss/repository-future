/* server/manage/jwt.js */
import jwt from "jsonwebtoken";

// ----> use package `jsonwebtoken` to generate `user token`
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// ----> use user token `key` to verify if token is true
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
