import { dashboardController } from "./controllers/dashboard-controller.js";

export const webRoutes = [{ method: "GET", path: "/", handler: dashboardController.index }];
