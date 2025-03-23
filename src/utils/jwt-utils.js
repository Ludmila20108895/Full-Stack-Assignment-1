import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { db } from "../models/db.js";

dotenv.config();

export function createToken(user) {
  const payload = { id: user._id, email: user.email };
  const options = { algorithm: "HS256", expiresIn: "1h" };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

export function decodeToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export async function validate(decoded, request) {
  const user = await db.userStore.getUserById(decoded.id);
  return { isValid: !!user, credentials: user };
}
