import { poiController } from "../controllers/poi-controller.js";

export const apiRoutes = [
  { method: "GET", path: "/api/pois", handler: poiController.getAllPois }, // Get all POIs
  { method: "POST", path: "/api/pois", handler: poiController.createPoi }, // Create POI
  { method: "GET", path: "/api/pois/{id}", handler: poiController.getPoiById }, // Get single POI
  { method: "PUT", path: "/api/pois/{id}", handler: poiController.updatePoi }, // Update POI
  { method: "DELETE", path: "/api/pois/{id}", handler: poiController.deletePoi }, // Delete POI
];
