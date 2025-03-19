import Joi from "joi"; // ✅ Correct Joi import

// ✅ Schema for User Signup
export const UserSpec = Joi.object({
  firstName: Joi.string().min(3).max(30).required().messages({
    "string.empty": "First Name is required!",
    "string.min": "First Name should have at least 3 characters!",
    "string.max": "First Name should not exceed 30 characters!",
  }),
  lastName: Joi.string().min(3).max(30).required().messages({
    "string.empty": "Last Name is required!",
    "string.min": "Last Name should have at least 3 characters!",
    "string.max": "Last Name should not exceed 30 characters!",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required!",
    "string.email": "Invalid email format!",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required!",
    "string.min": "Password should have at least 6 characters!",
  }),
});

// ✅ Schema for User Login
export const UserCredentialsSpec = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required!",
    "string.email": "Invalid email format!",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required!",
  }),
});
