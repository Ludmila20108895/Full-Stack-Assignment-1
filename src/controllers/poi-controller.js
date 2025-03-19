import { Poi } from "../models/mongo/poi-model.js";
import { PoiSpec } from "../models/joi-schemas.js";

export const poiController = {
  // ✅ Show POI List on Login (poi-list.hbs)
  async listPois(request, h) {
    try {
      if (!request.auth.isAuthenticated) return h.redirect("/login");

      return h.view("poi-list", { isAuthenticated: true });
    } catch (error) {
      console.error("Error loading POI list:", error);
      return h.view("poi-list", { error: "Could not load places!", isAuthenticated: true });
    }
  },

  // ✅ Show Add POI Form (add-poi.hbs) - Specific to Category
  async showAddPoiForm(request, h) {
    if (!request.auth.isAuthenticated) return h.redirect("/login");

    const category = request.query.category || "";

    // ✅ Fetch only POIs belonging to this category
    const pois = await Poi.find({ category, createdBy: request.auth.credentials.id }).lean();

    return h.view("add-poi", { pois, category, isAuthenticated: true });
  },

  // ✅ Add a New Place (without description and image)
  async addPoi(request, h) {
    try {
      if (!request.auth.isAuthenticated) return h.redirect("/login");

      console.log("🔹 Received Data:", request.payload);

      // ✅ Validate input
      const { error, value } = PoiSpec.validate(request.payload, { abortEarly: false });
      if (error) {
        console.log("Validation Error:", error.details);
        const pois = await Poi.find({
          category: request.payload.category,
          createdBy: request.auth.credentials.id,
        }).lean();
        return h.view("add-poi", { pois, errors: error.details, isAuthenticated: true });
      }

      // ✅ Save the new place
      const newPoi = new Poi({
        name: value.name,
        category: request.payload.category,
        createdBy: request.auth.credentials.id,
      });

      await newPoi.save();
      console.log("✅ POI Saved:", newPoi);

      // ✅ Fetch updated places after adding
      const pois = await Poi.find({
        category: request.payload.category,
        createdBy: request.auth.credentials.id,
      }).lean();

      return h.view("add-poi", { pois, category: request.payload.category, isAuthenticated: true });
    } catch (error) {
      console.error("Error adding POI:", error);
      return h.view("add-poi", { error: "Could not add POI. Try again!", isAuthenticated: true });
    }
  },

  // ✅ Show a Single Place's Details (poi.hbs)
  async showPoi(request, h) {
    try {
      if (!request.auth.isAuthenticated) return h.redirect("/login");

      const poi = await Poi.findById(request.params.id).lean();
      if (!poi) return h.view("added-places", { error: "POI not found!", isAuthenticated: true });

      return h.view("poi", { poi, isAuthenticated: true });
    } catch (error) {
      console.error(" Error fetching POI:", error);
      return h.view("added-places", { error: "Failed to load POI!", isAuthenticated: true });
    }
  },

  // ✅ Delete a POI
  async deletePoi(request, h) {
    try {
      if (!request.auth.isAuthenticated) return h.redirect("/login");

      // ✅ Find and delete the POI
      const poi = await Poi.findByIdAndDelete(request.params.id);
      if (!poi) return h.view("poi-list", { error: "POI not found!", isAuthenticated: true });

      console.log(`Deleted POI: ${request.params.id}`);

      return h.redirect(`/pois/add?category=${poi.category}`); // ✅ Stay in the correct category
    } catch (error) {
      console.error("Error deleting POI:", error);
      return h.view("add-poi", { error: "Failed to delete POI!", isAuthenticated: true });
    }
  },
  // ✅ Show the List of Added Places (added-places.hbs)
  async showAddedPlaces(request, h) {
    try {
      if (!request.auth.isAuthenticated) return h.redirect("/login");

      // ✅ Get POI by ID instead of category
      const poi = await Poi.findById(request.params.id).lean();
      if (!poi) return h.view("added-places", { error: "POI not found!", isAuthenticated: true });

      return h.view("added-places", { poi, isAuthenticated: true });
    } catch (error) {
      console.error("Error loading POI:", error);
      return h.view("added-places", { error: "Could not load POI details!", isAuthenticated: true });
    }
  },
};
