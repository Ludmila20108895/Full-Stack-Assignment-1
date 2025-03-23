import { assert } from "chai";
import { ExplorerService } from "./ExplorerService.js";
import { testUser, testPoi } from "../fixtures.js";

describe("Added Places API Tests", () => {
  let createdPoi;

  before(async () => {
    await ExplorerService.clearAuth();
    await ExplorerService.createUser(testUser);
    await ExplorerService.authenticate(testUser);
  });

  beforeEach(async () => {
    await ExplorerService.deleteAllPois(); // will clean before each test

    const poi = await ExplorerService.createPoi(testPoi);
    createdPoi = poi;
  });

  test("get an added place by ID", async () => {
    const result = await ExplorerService.getAddedPlace(createdPoi._id);
    assert.exists(result);
    assert.equal(result.name, testPoi.name);
    assert.equal(result.category, testPoi.category);
  });

  test("get an added place - invalid ID", async () => {
    try {
      await ExplorerService.getAddedPlace("invalid-id-123");
      assert.fail("Should not return POI with invalid ID");
    } catch (error) {
      assert.equal(error.response.status, 404);
      assert.include(error.response.data.error, "not found");
    }
  });
});
