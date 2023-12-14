import {frontendTest, backendTest} from "./index.js";

test("config", () => {
  expect(frontendTest().environment).toBeTruthy();
  expect(backendTest().environment).toBeTruthy();
});
