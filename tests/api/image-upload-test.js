import { assert } from "chai";
import path from "path";
import { ExplorerService } from "./ExplorerService.js";
import { testUser, testPoi } from "../fixtures.js";

describe("Image Upload Tests", () => {
  let poi;

  setup(async () => {
    await ExplorerService.clearAuth();
    await ExplorerService.deleteAllPois();
    await ExplorerService.createUser(testUser);
    await ExplorerService.authenticate(testUser);
    poi = await ExplorerService.createPoi(testPoi);
  });

  test("upload image to selected place", async () => {
    const imagePath = path.resolve("tests/uploads/test-image.jpg");
    const result = await ExplorerService.uploadImageToPoi(poi._id, imagePath);
    assert.isTrue(result.status === 200 || result.status === 302);
  });

  test("uploaded image is saved to POI", async () => {
    const imagePath = path.resolve("tests/uploads/test-image.jpg");
    await ExplorerService.uploadImageToPoi(poi._id, imagePath);

    const updatedPoi = await ExplorerService.getPoiById(poi._id);
    assert.isArray(updatedPoi.images);
    assert.isAtLeast(updatedPoi.images.length, 1);
  });

  test("upload image to non-existent POI", async () => {
    try {
      const imagePath = path.resolve("tests/uploads/test-image.jpg");
      await ExplorerService.uploadImageToPoi("invalid-id-123", imagePath);
      assert.fail("Should not allow upload to invalid Place");
    } catch (error) {
      assert.equal(error.response.status, 404);
    }
  });
});
