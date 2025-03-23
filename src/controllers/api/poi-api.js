import Boom from "@hapi/boom";
import { Poi } from "../../models/mongo/poi-model.js";

export const poiApi = {
  // Create a new POI
  async create(request, h) {
    try {
      const poi = new Poi({
        name: request.payload.name,
        visitDate: new Date(request.payload.visitDate),
        category: request.payload.category,
        latitude: request.payload.latitude,
        longitude: request.payload.longitude,
        createdBy: request.auth.credentials._id,
      });

      const savedPoi = await poi.save();
      return h.response(savedPoi).code(201);
    } catch (err) {
      console.error("Error creating POI:", err);
      return Boom.badImplementation("Failed to create POI");
    }
  },

  // Get all POIs
  async getAll(request, h) {
    try {
      const pois = await Poi.find().lean();
      return pois;
    } catch (err) {
      return Boom.serverUnavailable("Database error");
    }
  },

  // Get POI by ID
  async getById(request, h) {
    try {
      const poi = await Poi.findById(request.params.id).lean();
      if (!poi) {
        return Boom.notFound("POI not found");
      }
      return poi;
    } catch (err) {
      return Boom.serverUnavailable("Invalid POI ID");
    }
  },

  // Delete all POIs
  async deleteAll(request, h) {
    try {
      await Poi.deleteMany({});
      return h.response().code(204);
    } catch (err) {
      return Boom.serverUnavailable("Error deleting POIs");
    }
  },

  // Upload image(s) to POI
  async uploadImage(request, h) {
    try {
      const poi = await Poi.findById(request.params.id);
      if (!poi) return Boom.notFound("POI not found");

      const files = request.payload.images;
      const imageFiles = Array.isArray(files) ? files : [files];

      imageFiles.forEach((file) => {
        poi.images.push(file.filename);
      });

      await poi.save();
      return h.response(poi).code(200);
    } catch (err) {
      console.error("Upload error:", err);
      return Boom.serverUnavailable("Image upload failed");
    }
  },

  // Added place (reuses POI data)
  async getAddedPlace(request, h) {
    try {
      const poi = await Poi.findById(request.params.id).lean();
      if (!poi) return Boom.notFound("No Place found with this id");
      return poi;
    } catch (err) {
      return Boom.serverUnavailable("Database Error");
    }
  },
};
