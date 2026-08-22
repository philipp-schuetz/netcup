import { describe, expect, test } from "bun:test";
import { productSlugs } from "../src/catalog";
import {
  createEmptyVoucherCodeMap,
  defaultSourceUrl,
  fetchVoucherInventory,
  normalizeVoucherCodeMap,
} from "../src/inventory";

describe("voucher API", () => {
  test("uses the dedicated hourly CLI endpoint by default", () => {
    expect(defaultSourceUrl).toBe("https://netcupgutschein.com/api/cli/vouchers");
  });

  test("keeps valid known codes, removes duplicates, and ignores extra fields", () => {
    const products = createEmptyVoucherCodeMap();
    products["root-1000-g12"] = [
      "0000nc0000000000",
      "0000nc0000000000",
      "not-a-voucher",
    ];
    const normalized = normalizeVoucherCodeMap({ ...products, unrelated: ["ignored"] });

    expect(normalized?.["root-1000-g12"]).toEqual(["0000nc0000000000"]);
    expect(Object.keys(normalized ?? {})).toEqual(productSlugs);
  });

  test("performs one GET request and reads only the public product map", async () => {
    const products = createEmptyVoucherCodeMap();
    products["vps-1000-g12"] = ["0000nc1111111111"];
    let requests = 0;
    const fetchImpl = (async (_url: string | URL | Request, init?: RequestInit) => {
      requests += 1;
      expect(init?.method).toBe("GET");
      return new Response(JSON.stringify({ products, unrelated: "ignored" }));
    }) as typeof fetch;

    const inventory = await fetchVoucherInventory({
      fetchImpl,
      sourceUrl: "https://example.test/vouchers",
    });
    expect(requests).toBe(1);
    expect(inventory.products["vps-1000-g12"]).toEqual(["0000nc1111111111"]);
  });

  test("rejects incomplete product maps", () => {
    expect(normalizeVoucherCodeMap({ "root-1000-g12": [] })).toBeNull();
  });
});
