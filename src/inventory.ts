import { productSlugs, voucherTypeIds, type ProductSlug } from "./catalog";

export const defaultSourceUrl = "https://netcupgutschein.com/api/cli/vouchers";

export type VoucherCodeMap = Record<ProductSlug, string[]>;

export type VoucherInventory = {
  products: VoucherCodeMap;
  fetchedAt: string;
  refreshAfter: string;
};

export type FetchInventoryOptions = {
  fetchImpl?: typeof fetch;
  sourceUrl?: string;
  timeoutMs?: number;
};

export function createEmptyVoucherCodeMap(): VoucherCodeMap {
  return Object.fromEntries(productSlugs.map((slug) => [slug, []])) as unknown as VoucherCodeMap;
}

export function normalizeVoucherCodeMap(value: unknown): VoucherCodeMap | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const result = createEmptyVoucherCodeMap();
  for (const slug of productSlugs) {
    const codes = (value as Record<string, unknown>)[slug];
    if (!Array.isArray(codes)) return null;
    result[slug] = [...new Set(codes.filter((code): code is string => (
      typeof code === "string" && new RegExp(`^${voucherTypeIds[slug]}nc\\d{10,}$`).test(code)
    )))];
  }
  return result;
}

export async function fetchVoucherInventory(options: FetchInventoryOptions = {}): Promise<VoucherInventory> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const sourceUrl = options.sourceUrl ?? process.env.NETCUP_VOUCHER_SOURCE ?? defaultSourceUrl;
  const response = await fetchImpl(sourceUrl, {
    method: "GET",
    headers: {
      accept: "application/json",
      "user-agent": "netcup-voucher-cli/0.1 (+https://github.com/philipp-schuetz/netcup)",
    },
    signal: AbortSignal.timeout(options.timeoutMs ?? 12_000),
  });

  if (!response.ok) throw new Error("Voucher API returned HTTP " + response.status);

  let payload: unknown;
  try {
    payload = JSON.parse(await response.text());
  } catch {
    throw new Error("Voucher API returned invalid JSON");
  }

  const record = payload && typeof payload === "object" ? payload as Record<string, unknown> : null;
  const products = normalizeVoucherCodeMap(record?.products);
  if (!products) throw new Error("Voucher API returned an invalid product map");

  const fetchedAt = typeof record?.fetchedAt === "string" ? record.fetchedAt : "";
  const refreshAfter = typeof record?.refreshAfter === "string" ? record.refreshAfter : "";
  const fetched = Date.parse(fetchedAt), refresh = Date.parse(refreshAfter), now = Date.now();
  if (!Number.isFinite(fetched) || !Number.isFinite(refresh) || fetched > now + 60_000
    || now - fetched > 65 * 60_000 || refresh <= now || refresh - fetched > 65 * 60_000) {
    throw new Error("Voucher API returned an expired or invalid snapshot timestamp");
  }
  return { products, fetchedAt, refreshAfter };
}
