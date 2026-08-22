import { describe, expect, test } from "bun:test";
import { parseArguments } from "../src/cli";

describe("argument parser", () => {
  test("accepts one product query and JSON output", () => {
    expect(parseArguments(["RS", "1000", "G12", "--json"])).toEqual({
      productQuery: "RS 1000 G12",
      flags: { all: false, help: false, json: true, version: false },
    });
  });

  test("accepts an explicit all-products query", () => {
    expect(parseArguments(["--all", "--json"])).toEqual({
      productQuery: undefined,
      flags: { all: true, help: false, json: true, version: false },
    });
  });

  test("accepts an HTTPS source", () => {
    expect(parseArguments(["--source=https://example.test/vouchers"])).toEqual({
      productQuery: undefined,
      flags: {
        all: false,
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

  test("shows help without querying the API when called without arguments", async () => {
    const child = Bun.spawn([process.execPath, "src/bin.ts"], {
      stdout: "pipe",
      stderr: "pipe",
    });
    const [exitCode, stdout, stderr] = await Promise.all([
      child.exited,
      new Response(child.stdout).text(),
      new Response(child.stderr).text(),
    ]);

    expect(exitCode).toBe(0);
    expect(stdout).toContain("Usage:");
    expect(stdout).toContain("netcup --all");
    expect(stderr).toBe("");
  });
});
