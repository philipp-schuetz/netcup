import { describe, expect, test } from "bun:test";
import { parseArguments, version } from "../src/cli";

describe("argument parser", () => {
  test("keeps the CLI and package versions in sync", async () => {
    const manifest = await Bun.file("package.json").json();
    expect(version).toBe(manifest.version);
  });

  test("accepts one product query and JSON output", () => {
    expect(parseArguments(["RS", "1000", "G12", "--json"])).toEqual({
      command: "query",
      productQuery: "RS 1000 G12",
      flags: { all: false, help: false, json: true, version: false },
    });
  });

  test("accepts an explicit all-products query", () => {
    expect(parseArguments(["--all", "--json"])).toEqual({
      command: "query",
      productQuery: undefined,
      flags: { all: true, help: false, json: true, version: false },
    });
  });

  test("accepts an HTTPS source", () => {
    expect(parseArguments(["--source=https://example.test/vouchers"])).toEqual({
      command: "query",
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

  test("accepts the list command with JSON output", () => {
    expect(parseArguments(["list", "--json"])).toEqual({
      command: "list",
      flags: { all: false, help: false, json: true, version: false },
    });
  });

  test("rejects arguments after the list command", () => {
    expect(() => parseArguments(["list", "extra"])).toThrow(
      "Command list does not accept arguments",
    );
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

  test("lists the product catalog without voucher codes", async () => {
    const child = Bun.spawn([process.execPath, "src/bin.ts", "list"], {
      stdout: "pipe",
      stderr: "pipe",
    });
    const [exitCode, stdout, stderr] = await Promise.all([
      child.exited,
      new Response(child.stdout).text(),
      new Response(child.stderr).text(),
    ]);

    expect(exitCode).toBe(0);
    expect(stdout).toContain("PRODUCT");
    expect(stdout).toContain("root-1000-g12");
    expect(stdout).toContain("webhosting-8000");
    expect(stdout).not.toContain("CODE");
    expect(stderr).toBe("");
  });

  test("lists the product catalog as JSON", async () => {
    const child = Bun.spawn([process.execPath, "src/bin.ts", "list", "--json"], {
      stdout: "pipe",
      stderr: "pipe",
    });
    const [exitCode, stdout, stderr] = await Promise.all([
      child.exited,
      new Response(child.stdout).text(),
      new Response(child.stderr).text(),
    ]);

    const output = JSON.parse(stdout) as {
      products: Array<{ name: string; slug: string }>;
    };
    expect(exitCode).toBe(0);
    expect(output.products).toHaveLength(11);
    expect(output.products[0]).toEqual({
      name: "RS 1000 G12",
      slug: "root-1000-g12",
    });
    expect(stdout).not.toContain('"codes"');
    expect(stderr).toBe("");
  });
});
