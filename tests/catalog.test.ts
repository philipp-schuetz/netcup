import { describe, expect, test } from "bun:test";
import { findProducts, resolveProduct } from "../src/catalog";

describe("product lookup", () => {
  test("resolves product slugs and names", () => {
    expect(resolveProduct("rs-1000")?.slug).toBe("root-1000-g12-5");
    expect(resolveProduct("Webhosting 4000")?.slug).toBe("webhosting-4000-nue");
  });

  test("returns every fuzzy match while keeping singular resolution unambiguous", () => {
    expect(findProducts("root").map((product) => product.slug)).toEqual([
      "root-1000-g12-5",
      "root-2000-g12-5",
      "root-8000-g12-5",
    ]);
    expect(findProducts("1000").map((product) => product.slug)).toEqual([
      "root-1000-g12-5",
      "vps-1000-g12-5",
    ]);
    expect(resolveProduct("g12")).toBeNull();
  });

  test("returns no products for empty or unknown queries", () => {
    expect(findProducts("---")).toEqual([]);
    expect(findProducts("dedicated-arm")).toEqual([]);
  });
});

test('monthly hosting resolves independently from the twelve-month product', () => {
  expect(resolveProduct('webhosting-2000-nue-1m')?.slug).toBe('webhosting-2000-nue-1m');
  expect(resolveProduct('webhosting-2000-nue')?.slug).toBe('webhosting-2000-nue');
  expect(resolveProduct('Webhosting 2000')).toBeNull();
});
