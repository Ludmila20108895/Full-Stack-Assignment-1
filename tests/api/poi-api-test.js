import { assert } from "chai";
import { ExplorerService } from "./ExplorerService.js";
import { testUser, testPoi } from "../fixtures.js";

describe("POI API Tests", () => {
  let createdPoi;

  setup(async () => {
    await ExplorerService.createUser(testUser);
    await ExplorerService.authenticate(testUser);
  });

  test("create a POI", async () => {
    createdPoi = await ExplorerService.createPoi(testPoi);
    assert.equal(createdPoi.name, testPoi.name);
  });

  test("fetch POI by ID", async () => {
    const poi = await ExplorerService.getPoiById(createdPoi._id);
    assert.exists(poi);
  });

  test("delete POI", async () => {
    const res = await ExplorerService.deletePoi(createdPoi._id);
    assert.equal(res.status, 302);
  });
});
