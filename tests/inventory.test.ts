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
    products["root-1000-g12-5"] = [
      "6874nc0000000000",
      "6874nc0000000000",
      "not-a-voucher",
    ];
    const normalized = normalizeVoucherCodeMap({ ...products, unrelated: ["ignored"] });

    expect(normalized?.["root-1000-g12-5"]).toEqual(["6874nc0000000000"]);
    expect(Object.keys(normalized ?? {})).toEqual(productSlugs);
  });

  test("performs one GET request and reads only the public product map", async () => {
    const products = createEmptyVoucherCodeMap();
    products["vps-1000-g12-5"] = ["6877nc1111111111"];
    let requests = 0;
    const fetchImpl = (async (_url: string | URL | Request, init?: RequestInit) => {
      requests += 1;
      expect(init?.method).toBe("GET");
      return new Response(JSON.stringify({ products, fetchedAt: new Date().toISOString(), refreshAfter: new Date(Date.now()+3600_000).toISOString(), unrelated: "ignored" }));
    }) as typeof fetch;

    const inventory = await fetchVoucherInventory({
      fetchImpl,
      sourceUrl: "https://example.test/vouchers",
    });
    expect(requests).toBe(1);
    expect(inventory.products["vps-1000-g12-5"]).toEqual(["6877nc1111111111"]);
  });

  test("rejects incomplete product maps", () => {
    expect(normalizeVoucherCodeMap({ "root-1000-g12-5": [] })).toBeNull();
  });
});


test("rejects retired or wrong-product coupons and accepts a genuinely exhausted inventory", () => {
  const products = createEmptyVoucherCodeMap();
  products["root-1000-g12-5"] = ["5997nc17871254360", "6875nc17927725000", "6874nc17927725000"];
  expect(normalizeVoucherCodeMap(products)?.["root-1000-g12-5"]).toEqual(["6874nc17927725000"]);
  expect(normalizeVoucherCodeMap(createEmptyVoucherCodeMap())).toEqual(createEmptyVoucherCodeMap());
});

test("rejects stale or future snapshots without retrying the upstream", async () => {
  for (const values of [
    { fetchedAt: "invalid", refreshAfter: "invalid" },
    { fetchedAt: new Date(Date.now()-7200_000).toISOString(), refreshAfter: new Date(Date.now()-3600_000).toISOString() },
    { fetchedAt: new Date(Date.now()+120_000).toISOString(), refreshAfter: new Date(Date.now()+3600_000).toISOString() },
  ]) {
    let calls = 0;
    const fetchImpl = (async () => { calls++; return Response.json({ products: createEmptyVoucherCodeMap(), ...values }); }) as unknown as typeof fetch;
    await expect(fetchVoucherInventory({fetchImpl})).rejects.toThrow("snapshot timestamp");
    expect(calls).toBe(1);
  }
});
