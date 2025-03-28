// import Joi from "@hapi/joi"; //  Swagger to infer validation
import { userApi } from "../controllers/api/user-api.js"; // Import User API controller functions
import { poiApi } from "../controllers/api/poi-api.js"; // Import POI API controller functions

export const apiRoutes = [
  // User API routes (For signup, login, fetching user info, deleting users)
  {
    method: "GET",
    path: "/api/users",
    config: {
      auth: false,
      tags: ["api", "users"],
      description: "Get all users",
      notes: "Returns a list of all registered users",
      handler: userApi.find,
    },
  },

  {
    method: "POST",
    path: "/api/users", // Create a new user
    config: {
      auth: false, // Public route (Auth strategy, UI = cookies)
      tags: ["api", "users"],
      description: "Create a new user",
      notes: "Registers a new user with firstName, lastName, email and password",
      handler: userApi.create, // Calls the create method from userApi
    },
  },
  {
    method: "POST",
    path: "/api/users/authenticate", // Login/authenticate a user
    config: {
      auth: false,
      tags: ["api", "users"],
      description: "Authenticate a user",
      notes: "Logs in user and returns JWT token",
      handler: userApi.authenticate,
    },
  },

  {
    method: "DELETE",
    path: "/api/users", // Delete all users (for admin/testing)
    config: {
      auth: false,
      tags: ["api", "users"],
      description: "Delete all users",
      notes: "Removes all users from the database",
      handler: userApi.deleteAll,
    },
  },
  {
    method: "GET",
    path: "/api/users/{id}", // Get user by ID
    config: {
      auth: false,
      tags: ["api", "users"],
      description: "Get user by ID",
      notes: "Returns a user object based on MongoDB ID",
      handler: userApi.getById,
    },
  },
  {
    method: "DELETE",
    path: "/api/users/{id}", // Delete a user by ID
    config: {
      auth: false,
      tags: ["api", "users"],
      description: "Delete a user by ID",
      notes: "Deletes a user and their data",
      handler: userApi.delete,
    },
  },

  // POI Endpoints (Full CRUD access + image upload)
  {
    method: "GET",
    path: "/api/pois", // Get all POIs
    config: {
      auth: "jwt",
      tags: ["api", "pois"],
      description: "Get all POIs",
      notes: "Returns all Points of Interest (POIs) from all users",
      handler: poiApi.getAll,
    },
  },
  {
    method: "POST",
    path: "/api/pois", // Add a new POI
    config: {
      auth: "jwt", // Requires JWT auth. (Auth strategy, API = JWTs )
      tags: ["api", "pois"],
      description: "Create a new POI",
      notes: "Add a new Point of Interest (POI)",
      handler: poiApi.create,
    },
  },
  {
    method: "DELETE",
    path: "/api/pois", // Delete all POIs (admin/testing)
    config: {
      auth: "jwt",
      tags: ["api", "pois"],
      description: "Delete all POIs",
      notes: "Remove all Points of Interest",
      handler: poiApi.deleteAll,
    },
  },

  {
    method: "GET",
    path: "/api/pois/{id}", // Get POI by ID
    config: {
      auth: "jwt",
      tags: ["api", "pois"],
      description: "Get POI by ID",
      notes: "Returns Point of Interest using its ID",

      handler: poiApi.getById,
    },
  },
  {
    method: "DELETE",
    path: "/api/pois/{id}", // Delete a POI by ID
    config: {
      auth: "jwt",
      tags: ["api", "pois"],
      description: "Delete POI by ID",
      notes: "Deletes a POI record from the database",
      handler: poiApi.delete,
    },
  },

  {
    method: "GET",
    path: "/api/added-places/{id}", // View a user-specific POI
    config: {
      auth: "jwt",
      tags: ["api", "pois"],
      description: "Get added place by user ID",
      notes: "Returns POIs added by a specific user",
      handler: poiApi.getAddedPlace,
    },
  },
  {
    method: "POST",
    path: "/api/pois/{id}/upload", // Upload image(s) for a POI
    config: {
      auth: "jwt",
      tags: ["api", "images"],
      description: "Upload an image to a POI",
      notes: "Attach an image file to a POI by ID",
      payload: {
        output: "stream", // Handle file as stream
        parse: true,
        multipart: true, // Expect multipart form data
        maxBytes: 20 * 1024 * 1024, // Limit file size to 20MB
        allow: "multipart/form-data",
      },
      handler: poiApi.uploadImage,
    },
  },
];
