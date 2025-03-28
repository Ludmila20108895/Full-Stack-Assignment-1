import Boom from "@hapi/boom"; // Import Boom for standardized HTTP error responses
import { Poi } from "../../models/mongo/poi-model.js"; // Import the POI model from MongoDB

// Export all API route handlers for POI-related operations
export const poiApi = {
  // Create a new POI (POST /api/pois)
  async create(request, h) {
    try {
      const userId = request.auth?.credentials?._id;
      if (!userId) return Boom.unauthorized("You must be logged in to create a POI"); // Return 401 if user is not authenticated

      const poi = new Poi({
        name: request.payload.name,
        visitDate: new Date(request.payload.visitDate),
        category: request.payload.category,
        latitude: request.payload.latitude,
        longitude: request.payload.longitude,
        createdBy: userId,
      });

      const savedPoi = await poi.save(); // Save updated POI document to the database
      return h.response(savedPoi).code(201); // Send a structured HTTP response (New resource successfully created)
    } catch (err) {
      console.error("Error creating POI:", err);
      return Boom.badImplementation("Failed to create POI"); // Return 500 Internal Server Error – Unexpected error on the server
    }
  },

  // Retrieve all POIs (GET /api/pois)
  async getAll(_request, _h) {
    const pois = await Poi.find().lean(); // Query the POI collection in MongoDB
    return pois;
  },

  // Get a specific POI by ID (GET /api/pois/:id)
  async getById(request, h) {
    const poi = await Poi.findById(request.params.id).lean(); // Query the POI collection in MongoDB
    if (!poi) {
      return h.response({ error: "POI not found" }).code(404); //  HTTP response (Resource doesn't exist)
    }
    return h.response(poi).code(200); //  HTTP response (Request was successful)
  },

  // Delete a single POI by ID (DELETE /api/pois/:id)
  async delete(request, h) {
    const poi = await Poi.findByIdAndDelete(request.params.id); // Query the POI collection in MongoDB
    if (!poi) return h.response({ error: "POI not found" }).code(404); //  HTTP response (Resource doesn't exist)
    return h.response().code(204); // HTTP response (Request succeeded, no response/returned)
  },

  // Delete all POIs from the database (DELETE /api/pois)
  async deleteAll(_req, h) {
    await Poi.deleteMany({}); // Remove all POI documents from the database
    return h.response().code(204); //  HTTP response (Request succeeded, no response/returned
  },

  // Add one or more images to a POI (POST /api/pois/:id/upload)
  async uploadImage(request, h) {
    const poi = await Poi.findById(request.params.id); // Query the POI collection in MongoDB
    if (!poi) return h.response({ error: "POI not found" }).code(404); //  HTTP response (Resource doesn't exist)

    const files = request.payload.images;
    const imageFiles = Array.isArray(files) ? files : [files];

    imageFiles.forEach((file) => {
      poi.images.push(file.filename); // Append uploaded filenames to the POI images array
    });

    await poi.save(); // Save updated POI document to the database
    return h.response(poi).code(200); // Send a structured HTTP response (Request was successful)
  },

  // Get a specific "added place" POI (GET /api/added-places/:id)
  async getAddedPlace(request, h) {
    const poi = await Poi.findById(request.params.id).lean(); // Query the POI collection in MongoDB
    if (!poi) return h.response({ error: " Place not found" }).code(404); //  HTTP response (Resource doesn't exist)
    return h.response(poi).code(200); // Send a structured HTTP response (Request was successful)
  },
};
