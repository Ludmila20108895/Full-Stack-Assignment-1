// Import controllers that handle logic for auth and dashboard
import { authController } from "../controllers/auth-controller.js";
import { dashboardController } from "../controllers/dashboard-controller.js";

// Import additional POI-related routes (defined in a separate file)
import { poiRoutes } from "./poi-routes.js";

// Main route definitions
export const routes = [
  {
    method: "GET",
    path: "/", // Home page
    options: { auth: false },
    handler: dashboardController.index,
  },
  {
    method: "GET",
    path: "/login", // Show login form
    options: { auth: false },
    handler: authController.showLogin,
  },
  {
    method: "POST",
    path: "/login", // Handle login form submission
    options: { auth: false },
    handler: authController.login,
  },
  {
    method: "GET",
    path: "/signup", // Show signup form
    options: { auth: false },
    handler: authController.showSignup,
  },
  {
    method: "POST",
    path: "/signup", // Handle signup form submission
    options: { auth: false },
    handler: authController.signup,
  },
  {
    method: "GET",
    path: "/logout", // Log the user out
    handler: authController.logout,
  },
  {
    method: "GET",
    path: "/dashboard", // Authenticated user dashboard
    options: { auth: "session" }, //  Require login for dashboard
    handler: dashboardController.index,
  },
];
// Combine core routes with POI routes into a single list
export const allRoutes = [...routes, ...poiRoutes];
