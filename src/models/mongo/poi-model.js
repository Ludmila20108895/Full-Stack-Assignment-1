import mongoose from "mongoose";

const poiSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // ✅ Now each place has a category
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export const Poi = mongoose.model("Poi", poiSchema);
