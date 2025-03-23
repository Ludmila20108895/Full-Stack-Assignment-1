import { assert } from "chai";
import { ExplorerService } from "./api/ExplorerService.js";
import { testUser } from "./fixtures.js";

suite("Auth Controller Tests", () => {
  setup(async () => {
    await ExplorerService.clearAuth();
  });

  test("sign up and login", async () => {
    await ExplorerService.createUser(testUser);
    const result = await ExplorerService.authenticate(testUser);
    assert.exists(result);
  });
});
