import { assert } from "chai";
import mongoose from "mongoose";
import { Poi } from "../../src/models/mongo/poi-model.js";

describe("POI Model Tests", () => {
  before(async () => {
    await mongoose.connect("mongodb://localhost/placemark-test");
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it("should create a new POI document", async () => {
    const poi = new Poi({
      name: "Test Location",
      category: "City",
      visitDate: new Date("2023-03-20"),
      latitude: 40.7128,
      longitude: -74.006,
      createdBy: new mongoose.Types.ObjectId(),
    });

    const savedPoi = await poi.save();
    assert.exists(savedPoi._id);
    assert.equal(savedPoi.name, "Test Location");
  });

  it("should delete a POI document", async () => {
    const poi = await Poi.findOne({ name: "Test Location" });
    const result = await Poi.deleteOne({ _id: poi._id });
    assert.equal(result.deletedCount, 1);
  });
});
