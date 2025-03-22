import { poiController } from "../controllers/poi-controller.js";
import { upload } from "../utils/upload-utils.js";

export const poiRoutes = [
  { method: "GET", path: "/pois", handler: poiController.listPois }, //  Main POI List
  { method: "GET", path: "/pois/add", handler: poiController.showAddPoiForm }, //  Add Form
  { method: "POST", path: "/pois", handler: poiController.addPoi }, //  Add POI
  { method: "GET", path: "/pois/{id}", handler: poiController.showPoi }, //  View POI
  { method: "POST", path: "/pois/delete/{id}", handler: poiController.deletePoi }, //  Delete POI
  { method: "GET", path: "/added-places/{id}", handler: poiController.showAddedPlaces },
  {
    method: "POST",
    path: "/pois/{id}/upload",
    handler: poiController.uploadImages,
    options: { payload: { output: "stream", parse: true, multipart: true } },
  },
];
