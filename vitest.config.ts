import {defineConfig} from "vitest/config";
import {frontend} from "./index.ts";

export default defineConfig(frontend({url: import.meta.url}));
