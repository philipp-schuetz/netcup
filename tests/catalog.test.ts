import { describe, expect, test } from "bun:test";
import { resolveProduct } from "../src/catalog";

describe("product lookup", () => {
  test("resolves product slugs and names", () => {
    expect(resolveProduct("rs-1000")?.slug).toBe("root-1000-g12");
    expect(resolveProduct("Webhosting 4000")?.slug).toBe("webhosting-4000");
  });

  test("rejects ambiguous product names", () => {
    expect(resolveProduct("g12")).toBeNull();
  });
});
