import {expect, type MatchersObject} from "vitest";
import matchers from "jest-extended";

expect.extend(matchers as unknown as MatchersObject);
