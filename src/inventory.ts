import { productSlugs, type ProductSlug } from "./catalog";

export const defaultSourceUrl = "https://netcupgutschein.com/api/cli/vouchers";

export type VoucherCodeMap = Record<ProductSlug, string[]>;

export type VoucherInventory = {
  products: VoucherCodeMap;
};

export type FetchInventoryOptions = {
  fetchImpl?: typeof fetch;
  sourceUrl?: string;
  timeoutMs?: number;
};

const voucherCodePattern = /^\d{4}nc\d{10,}$/;

export function createEmptyVoucherCodeMap(): VoucherCodeMap {
  return Object.fromEntries(productSlugs.map((slug) => [slug, []])) as unknown as VoucherCodeMap;
}

export function normalizeVoucherCodeMap(value: unknown): VoucherCodeMap | null {
  if (!value || typeof value !== "object") return null;

  const result = createEmptyVoucherCodeMap();
  for (const slug of productSlugs) {
    const codes = (value as Record<string, unknown>)[slug];
    if (!Array.isArray(codes)) return null;
    result[slug] = [...new Set(codes.filter((code): code is string => (
      typeof code === "string" && voucherCodePattern.test(code)
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

  return { products };
}
