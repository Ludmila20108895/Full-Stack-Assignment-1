import { assert } from "chai";
import mongoose from "mongoose";
import { User } from "../../src/models/mongo/user-model.js";

describe("User Model Tests", () => {
  before(async () => {
    await mongoose.connect("mongodb://localhost/placemark-test");
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it("should create a new user document", async () => {
    const user = new User({
      firstName: "Ludmila",
      lastName: "Bulat",
      email: "ludmila@example.com",
      password: "securepass123",
    });

    const savedUser = await user.save();
    assert.exists(savedUser._id);
    assert.equal(savedUser.email, "ludmila@example.com");
  });

  it("should delete a user document", async () => {
    const user = await User.findOne({ email: "ludmila@example.com" });
    const result = await User.deleteOne({ _id: user._id });
    assert.equal(result.deletedCount, 1);
  });
});
