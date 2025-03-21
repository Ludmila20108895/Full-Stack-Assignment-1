import mongoose from "mongoose";
import moment from "moment";

const poiSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  visitDate: { type: Date, required: true }, //  Date of visit
  images: [{ type: String }], //  Array to store multiple image URLs
  latitude: { type: Number, required: true }, //  Required for Google Maps
  longitude: { type: Number, required: true }, //  Required for Google Maps
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});
// Format Date to be displayed
poiSchema.methods.formatVisitDate = function () {
  return moment(this.visitDate).format("DD-MM-YYYY");
};

export const Poi = mongoose.model("Poi", poiSchema);
