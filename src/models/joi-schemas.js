import Joi from "joi";

// ✅ User Signup Validation (UNCHANGED)
export const UserSpec = Joi.object({
  firstName: Joi.string().min(3).max(30).required().messages({
    "string.empty": "First Name is required!",
    "string.min": "First Name must be at least 3 characters long.",
  }),
  lastName: Joi.string().min(3).max(30).required().messages({
    "string.empty": "Last Name is required!",
    "string.min": "Last Name must be at least 3 characters long.",
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

// ✅ User Login Validation (UNCHANGED)
export const UserCredentialsSpec = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required!",
    "string.email": "Invalid email format!",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required!",
  }),
});

// ✅ POI (Point of Interest) Validation - **Includes Category**
export const PoiSpec = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "POI name is required!",
    "string.min": "POI name must be at least 3 characters long.",
    "string.max": "POI name must not exceed 50 characters.",
  }),
  category: Joi.string().valid("Caves", "Beaches", "Mountains", "Parks", "Waterfalls", "Cities").required().messages({
    "string.empty": "Category is required!",
    "any.only": "Invalid category! Choose from Caves, Beaches, Mountains, Parks, Waterfalls, Cities.",
  }),
});
