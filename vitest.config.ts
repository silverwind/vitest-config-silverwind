import {defineConfig} from "vitest/config";
import {backend} from "./index.ts";

export default defineConfig(backend({url: import.meta.url}));
