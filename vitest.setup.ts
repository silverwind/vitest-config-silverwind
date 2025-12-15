import {expect} from "vitest";
import matchers from "jest-extended";
import {inspect} from "node:util";

expect.extend(matchers);
inspect.defaultOptions.depth = 4;
