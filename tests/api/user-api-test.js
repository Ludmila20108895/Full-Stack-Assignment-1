import { assert } from "chai";
import { ExplorerService } from "./ExplorerService.js";
import { testUser } from "../fixtures.js";

describe("User API Tests", () => {
  setup(async () => {
    await ExplorerService.clearAuth();
  });

  test("create a user", async () => {
    const user = await ExplorerService.createUser(testUser);
    assert.exists(user);
  });

  test("authenticate user", async () => {
    await ExplorerService.createUser(testUser);
    const authData = await ExplorerService.authenticate(testUser);
    assert.exists(authData);
  });
  test("get a user - bad id", async () => {
    try {
      await ExplorerService.getUser("badid1234");
      assert.fail("Should not find user with bad ID");
    } catch (error) {
      assert.equal(error.response.status, 404);
      assert.include(error.response.data.message, "No User with this id");
    }
  });
});
