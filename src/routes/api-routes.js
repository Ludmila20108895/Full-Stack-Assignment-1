import { userApi } from "../controllers/api/user-api.js";
import { poiApi } from "../controllers/api/poi-api.js";

export const apiRoutes = [
  // User Endpoints
  {
    method: "POST",
    path: "/api/users",
    config: {
      handler: userApi.create,
    },
  },
  {
    method: "POST",
    path: "/api/users/authenticate",
    config: {
      handler: userApi.authenticate,
    },
  },

  // POI Endpoints
  {
    method: "POST",
    path: "/api/pois",
    config: {
      handler: poiApi.create,
    },
  },
  {
    method: "GET",
    path: "/api/pois/{id}",
    config: {
      handler: poiApi.getById,
    },
  },
  {
    method: "DELETE",
    path: "/api/pois",
    config: {
      handler: poiApi.deleteAll,
    },
  },
  {
    method: "GET",
    path: "/api/added-places/{id}",
    config: {
      handler: poiApi.getAddedPlace,
    },
  },

  {
    method: "POST",
    path: "/api/pois/{id}/upload",
    config: {
      handler: poiApi.uploadImage,
      payload: {
        output: "stream",
        parse: true,
        multipart: true,
        maxBytes: 20 * 1024 * 1024, // 20MB
        allow: "multipart/form-data",
      },
    },
  },
];
