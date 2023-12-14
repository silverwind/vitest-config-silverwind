import {defineConfig} from "vitest/dist/config.js";
import {backendTest} from "./index.js";

export default defineConfig({
  test: backendTest(),
});
