import { describe, expect, test } from "bun:test";
import { parseArguments } from "../src/cli";

describe("argument parser", () => {
  test("accepts one product query and JSON output", () => {
    expect(parseArguments(["RS", "1000", "G12", "--json"])).toEqual({
      productQuery: "RS 1000 G12",
      flags: { help: false, json: true, version: false },
    });
  });

  test("accepts an HTTPS source", () => {
    expect(parseArguments(["--source=https://example.test/vouchers"])).toEqual({
      productQuery: undefined,
      flags: {
        help: false,
        json: false,
        version: false,
        source: "https://example.test/vouchers",
      },
    });
  });

  test("rejects unknown options", () => {
    expect(() => parseArguments(["--verbose"])).toThrow("Unknown option");
  });
});
