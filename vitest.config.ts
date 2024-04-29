import {defineConfig} from "vitest/dist/config.js";
import {backend} from "./index.ts";

export default defineConfig(backend({url: import.meta.url}));
