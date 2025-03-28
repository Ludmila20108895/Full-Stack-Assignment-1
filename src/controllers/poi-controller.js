import moment from "moment"; // Import moment for formatting dates
import fs from "fs"; // File system module for handling image uploads/deletes
import Path from "path"; // Path module to resolve file paths
import { Poi } from "../models/mongo/poi-model.js"; // Import the MongoDB POI model
import { PoiSpec } from "../models/joi-schemas.js"; // Joi schema for validating POI data
import cloudinary from "../utils/cloudinary.js";

// Export object containing all POI-related handlers
export const poiController = {
  // Show POI list (renders poi-list.hbs)
  async listPois(request, h) {
    if (!request.auth.isAuthenticated) return h.redirect("/login"); // Redirect if user is not logged in
    return h.view("poi-list", { isAuthenticated: true }); // Render view and pass auth state
  },

  // Show form to add a POI (renders add-poi.hbs)
  async showAddPoiForm(request, h) {
    if (!request.auth.isAuthenticated) return h.redirect("/login"); // Redirect to login if not authenticated

    const category = request.query.category || ""; // Get selected category from query string
    const pois = await Poi.find({ category, createdBy: request.auth.credentials.id }).lean(); // Fetch POIs created by user and match category

    pois.forEach((p) => {
      p.visitDate = moment(p.visitDate).format("DD-MM-YYYY"); // Format visit date for display
    });

    return h.view("add-poi", { pois, category, isAuthenticated: true }); // Render form with user's existing POIs
  },

  // Handle creation of a new POI
  async addPoi(request, h) {
    try {
      if (!request.auth.isAuthenticated) return h.redirect("/login"); // Redirect to another route

      const userId = request.auth.credentials.id;
      const { error, value } = PoiSpec.validate(request.payload, { abortEarly: false });

      // Query POI(s) from MongoDB
      if (error) {
        const pois = await Poi.find({
          category: request.payload.category,
          createdBy: userId,
        }).lean();
        // Render a Handlebars view with context data
        return h.view("add-poi", { pois, errors: error.details, isAuthenticated: true });
      }

      const formattedDate = moment(value.visitDate, "YYYY-MM-DD").toDate(); // Format date for user display

      const newPoi = new Poi({
        name: value.name,
        visitDate: formattedDate,
        latitude: value.latitude,
        longitude: value.longitude,
        category: value.category,
        createdBy: userId,
        images: [],
      });

      await newPoi.save();

      // Query POI(s) from MongoDB
      const pois = await Poi.find({
        category: request.payload.category,
        createdBy: userId,
      }).lean();
      // Render a Handlebars view with context data
      return h.view("add-poi", {
        pois,
        category: request.payload.category,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("Error adding Point of Interest:", error);
      return h.view("add-poi", {
        error: "Could not add Point of Interest. Try again!",
        isAuthenticated: true,
      });
    }
  },

  // Show detailed view of a single POI
  async showPoi(request, h) {
    try {
      const poi = await Poi.findById(request.params.id).lean(); // Query POI(s) from MongoDB
      if (!poi) {
        // Render a Handlebars view with context data
        return h.view("added-places", {
          error: "POI not found!",
          isAuthenticated: true,
        });
      }

      poi.visitDate = moment(poi.visitDate).format("DD-MM-YYYY"); // Format date for user display

      return h.view("added-places", {
        poi,
        isAuthenticated: true,
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      });
    } catch (error) {
      console.error("Error loading POI:", error);
      return h.view("added-places", {
        error: "Could not load POI details!",
        isAuthenticated: true,
      });
    }
  },

  // Handle uploading of one or more images for a POI
  async uploadImages(request, h) {
    try {
      // Query POI(s) from MongoDB
      const poi = await Poi.findById(request.params.id);
      if (!poi) {
        console.log("POI not found");
        return h.response({ error: "POI not found" }).code(404);
      }

      const { payload } = request;

      if (!payload || !payload.images) {
        console.log("No image files received");
        return h.redirect(`/added-places/${poi._id}`); // Redirect to another route
      }

      const imageFiles = Array.isArray(payload.images) ? payload.images : [payload.images];

      for (const file of imageFiles) {
        if (file && file.hapi && file.hapi.filename) {
          const { filename } = file.hapi;
          const uploadPath = Path.join(process.cwd(), "uploads", filename);
          const fileStream = fs.createWriteStream(uploadPath); // Create a writable stream to save uploaded file

          // eslint-disable-next-line no-await-in-loop
          await new Promise((resolve, reject) => {
            file.pipe(fileStream);
            file.on("end", resolve);
            file.on("error", reject);
          });

          poi.images.push(filename);
        }
      }

      await poi.save();

      console.log("Updated POI with images:", poi.images);

      return h.redirect(`/added-places/${poi._id}`);
    } catch (err) {
      console.error("Upload error:", err);
      return h.view("added-places", {
        error: "Error uploading images.",
        isAuthenticated: true,
      });
    }
  },
  // Handle deletion of a POI image
  async deleteImage(request, h) {
    try {
      const { id, filename } = request.params;
      // Query POI(s) from MongoDB
      const poi = await Poi.findById(id);

      if (!poi) {
        return h.response("POI not found").code(404);
      }

      // Remove image from DB
      poi.images = poi.images.filter((img) => img !== filename);
      await poi.save();

      // Remove file from filesystem
      const imagePath = Path.join(process.cwd(), "uploads", filename);
      // Delete file from server filesystem
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Failed to delete image:", err);
      });

      return h.redirect(`/added-places/${id}`); // Redirect to added-places route
    } catch (error) {
      console.error("Error deleting image:", error);
      return h.view("added-places", {
        error: "Failed to delete image",
        isAuthenticated: true,
      });
    }
  },

  // Delete a POI by its ID
  async deletePoi(request, h) {
    if (!request.auth.isAuthenticated) return h.redirect("/login");

    const poi = await Poi.findByIdAndDelete(request.params.id);
    if (!poi) return h.view("poi-list", { error: "POI not found", isAuthenticated: true });

    return h.redirect(`/pois/add?category=${poi.category}`);
  },

  // Show added places (renders added-places.hbs)
  async showAddedPlaces(request, h) {
    if (!request.auth.isAuthenticated) return h.redirect("/login"); // Redirect to user login

    const poi = await Poi.findById(request.params.id).lean();
    if (!poi) {
      return h.view("added-places", { error: "POI not found", isAuthenticated: true }); // Render a Handlebars view with context data
    }
    // console.log("POI for added-places view:", poi);
    return h.view("added-places", {
      poi,
      isAuthenticated: true,
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    });
  },
};
