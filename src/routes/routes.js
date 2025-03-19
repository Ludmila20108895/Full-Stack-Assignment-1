import { authController } from "../controllers/auth-controller.js";
import { dashboardController } from "../controllers/dashboard-controller.js";
import { poiRoutes } from "./poi-routes.js"; // ✅ Include POI routes

export const routes = [
  {
    method: "GET",
    path: "/",
    options: { auth: false },
    handler: dashboardController.index,
  },
  {
    method: "GET",
    path: "/login",
    options: { auth: false },
    handler: authController.showLogin,
  },
  {
    method: "POST",
    path: "/login",
    options: { auth: false },
    handler: authController.login,
  },
  {
    method: "GET",
    path: "/signup",
    options: { auth: false },
    handler: authController.showSignup,
  },
  {
    method: "POST",
    path: "/signup",
    options: { auth: false },
    handler: authController.signup,
  },
  {
    method: "GET",
    path: "/logout",
    handler: authController.logout,
  },
  {
    method: "GET",
    path: "/dashboard",
    options: { auth: "session" }, // ✅ Require login for dashboard
    handler: dashboardController.index,
  },
];

// ✅ Merge POI routes
export const allRoutes = [...routes, ...poiRoutes];
