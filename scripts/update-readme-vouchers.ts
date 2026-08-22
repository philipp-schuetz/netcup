import { readFile, writeFile } from "node:fs/promises";
import { products, type ProductSlug } from "../src/catalog";
import {
  fetchVoucherInventory,
  type VoucherCodeMap,
} from "../src/inventory";

export const voucherBlockStart = "<!-- voucher-codes:start -->";
export const voucherBlockEnd = "<!-- voucher-codes:end -->";

export const productUrls = {
  "root-1000-g12": "https://www.netcup.com/en/server/root-server/rs-1000-g12-ip-iv-12m",
  "root-2000-g12": "https://www.netcup.com/en/server/root-server/rs-2000-g12-ip-iv-12m",
  "root-4000-g12": "https://www.netcup.com/en/server/root-server/rs-4000-g12-ip-iv-12m",
  "root-8000-g12": "https://www.netcup.com/en/server/root-server/rs-8000-g12-ip-iv-12m",
  "vps-1000-g12": "https://www.netcup.com/en/server/vps/vps-1000-g12-iv-12m",
  "vps-2000-g12": "https://www.netcup.com/en/server/vps/vps-2000-g12-iv-12m",
  "vps-4000-g12": "https://www.netcup.com/en/server/vps/vps-4000-g12-iv-12m",
  "vps-8000-g12": "https://www.netcup.com/en/server/vps/vps-8000-g12-iv-12m",
  "webhosting-2000": "https://www.netcup.com/en/hosting/web-hosting/webhosting-2000-vie-iv",
  "webhosting-4000": "https://www.netcup.com/en/hosting/web-hosting/webhosting-4000-vie-iv",
  "webhosting-8000": "https://www.netcup.com/en/hosting/web-hosting/webhosting-8000-vie-iv",
} as const satisfies Record<ProductSlug, string>;

function formatTimestamp(value: Date) {
  if (Number.isNaN(value.getTime())) throw new Error("Invalid README update timestamp");
  return value.toISOString().slice(0, 16).replace("T", " ") + " UTC";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("|", "&#124;");
}

function renderCodes(codes: readonly string[]) {
  if (codes.length === 0) return "_None currently available_";
  return [...codes]
    .sort((left, right) => left < right ? -1 : left > right ? 1 : 0)
    .map((code) => `<code>${escapeHtml(code)}</code>`)
    .join("<br>");
}

export function renderVoucherBlock(
  inventory: VoucherCodeMap,
  timestamp: string,
) {
  const rows = products.map((product) => (
    `| [**${escapeHtml(product.name)}**](${productUrls[product.slug]})<br><sub>${escapeHtml(product.slug)}</sub> | ${renderCodes(inventory[product.slug])} |`
  ));

  return [
    voucherBlockStart,
    `_Last code update: **${timestamp}**_`,
    "",
    "| Product | Available voucher codes |",
    "| :-- | :-- |",
    ...rows,
    voucherBlockEnd,
  ].join("\n");
}

function findManagedBlock(readme: string) {
  const startCount = readme.split(voucherBlockStart).length - 1;
  const endCount = readme.split(voucherBlockEnd).length - 1;
  const start = readme.indexOf(voucherBlockStart);
  const endMarkerStart = readme.indexOf(voucherBlockEnd);

  if (startCount !== 1 || endCount !== 1 || endMarkerStart < start) {
    throw new Error("README must contain exactly one voucher-code marker pair");
  }

  return {
    start,
    end: endMarkerStart + voucherBlockEnd.length,
    current: readme.slice(start, endMarkerStart + voucherBlockEnd.length),
  };
}

function currentTimestamp(block: string) {
  return block.match(/_Last code update: \*\*(\d{4}-\d{2}-\d{2} \d{2}:\d{2} UTC)\*\*_/)?.[1];
}

export function updateReadmeVoucherBlock(
  readme: string,
  inventory: VoucherCodeMap,
  updatedAt: Date,
) {
  const managed = findManagedBlock(readme);
  const previousTimestamp = currentTimestamp(managed.current);

  if (previousTimestamp) {
    const unchangedCandidate = renderVoucherBlock(inventory, previousTimestamp);
    if (managed.current === unchangedCandidate) {
      return { changed: false, readme } as const;
    }
  }

  const nextBlock = renderVoucherBlock(inventory, formatTimestamp(updatedAt));
  return {
    changed: true,
    readme: readme.slice(0, managed.start) + nextBlock + readme.slice(managed.end),
  } as const;
}

async function main() {
  const readmeUrl = new URL("../README.md", import.meta.url);
  const [readme, inventory] = await Promise.all([
    readFile(readmeUrl, "utf8"),
    fetchVoucherInventory(),
  ]);
  const result = updateReadmeVoucherBlock(readme, inventory.products, new Date());

  if (!result.changed) {
    console.log("README voucher snapshot is already current.");
    return;
  }

  await writeFile(readmeUrl, result.readme, "utf8");
  const totalCodes = Object.values(inventory.products)
    .reduce((total, codes) => total + codes.length, 0);
  console.log(`Updated README voucher snapshot with ${totalCodes} available codes.`);
}

if (import.meta.main) await main();
