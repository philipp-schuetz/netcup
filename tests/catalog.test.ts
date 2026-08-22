import { describe, expect, test } from "bun:test";
import { findProducts, resolveProduct } from "../src/catalog";

describe("product lookup", () => {
  test("resolves product slugs and names", () => {
    expect(resolveProduct("rs-1000")?.slug).toBe("root-1000-g12");
    expect(resolveProduct("Webhosting 4000")?.slug).toBe("webhosting-4000");
  });

  test("returns every fuzzy match while keeping singular resolution unambiguous", () => {
    expect(findProducts("root").map((product) => product.slug)).toEqual([
      "root-1000-g12",
      "root-2000-g12",
      "root-4000-g12",
      "root-8000-g12",
    ]);
    expect(findProducts("1000").map((product) => product.slug)).toEqual([
      "root-1000-g12",
      "vps-1000-g12",
    ]);
    expect(resolveProduct("g12")).toBeNull();
  });

  test("returns no products for empty or unknown queries", () => {
    expect(findProducts("---")).toEqual([]);
    expect(findProducts("dedicated-arm")).toEqual([]);
  });
});
