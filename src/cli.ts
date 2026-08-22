import {
  products,
  resolveProduct,
  type Product,
} from "./catalog";
import {
  fetchVoucherInventory,
  type VoucherInventory,
} from "./inventory";

export const version = "0.1.1";

type Flags = {
  all: boolean;
  help: boolean;
  json: boolean;
  version: boolean;
  source?: string;
};

export type ParsedArguments = {
  productQuery?: string;
  flags: Flags;
};

const booleanFlags = new Set(["all", "help", "json", "version"]);
const shortFlags: Record<string, "all" | "help" | "json" | "version"> = {
  a: "all",
  h: "help",
  j: "json",
  v: "version",
};

export function parseArguments(argv: string[]): ParsedArguments {
  const flags: Flags = { all: false, help: false, json: false, version: false };
  const positionals: string[] = [];

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument.startsWith("--")) {
      const [name, inlineValue] = argument.slice(2).split("=", 2);
      if (booleanFlags.has(name)) {
        if (inlineValue !== undefined) throw new Error("Option --" + name + " does not take a value");
        (flags as Record<string, unknown>)[name] = true;
        continue;
      }
      if (name === "source") {
        const value = inlineValue ?? argv[index + 1];
        if (!value || (inlineValue === undefined && value.startsWith("-"))) {
          throw new Error("Option --source requires a value");
        }
        flags.source = value;
        if (inlineValue === undefined) index += 1;
        continue;
      }
      throw new Error("Unknown option: --" + name);
    }

    if (argument.startsWith("-") && argument.length === 2) {
      const name = shortFlags[argument.slice(1)];
      if (!name) throw new Error("Unknown option: " + argument);
      flags[name] = true;
      continue;
    }

    positionals.push(argument);
  }

  return {
    productQuery: positionals.join(" ") || undefined,
    flags,
  };
}

export function printHelp() {
  console.log([
    "netcup " + version + " — query available product voucher codes",
    "",
    "Usage:",
    "  netcup                            Show help",
    "  netcup --all                      List products and voucher codes",
    "  netcup <product>                  Filter to one product",
    "",
    "Options:",
    "  --all, -a                         Query every supported product",
    "  --source <https-url>              Override the voucher API endpoint",
    "  --json, -j                        Print JSON",
    "  --help, -h                        Show help",
    "  --version, -v                     Show the version",
    "",
    "Examples:",
    "  netcup",
    "  netcup --all",
    "  netcup vps-1000-g12",
    "  netcup \"RS 1000 G12\" --json",
  ].join("\n"));
}

function sourceUrl(value: string | undefined) {
  if (!value) return undefined;
  const url = new URL(value);
  if (url.protocol !== "https:") throw new Error("--source must be an HTTPS URL");
  return url.toString();
}

function requireProduct(query: string) {
  const product = resolveProduct(query);
  if (product) return product;
  throw new Error("Unknown or ambiguous product: " + query);
}

function productResult(product: Product, inventory: VoucherInventory) {
  return {
    slug: product.slug,
    name: product.name,
    codes: inventory.products[product.slug],
  };
}

function renderTable(headers: string[], rows: string[][]) {
  const widths = headers.map((header, column) => Math.max(
    header.length,
    ...rows.map((row) => row[column]?.length ?? 0),
  ));
  const line = (row: string[]) => row
    .map((value, column) => value.padEnd(widths[column]))
    .join("  ")
    .trimEnd();

  console.log(line(headers));
  console.log(widths.map((width) => "-".repeat(width)).join("  "));
  for (const row of rows) console.log(line(row));
}

export async function main(argv = process.argv.slice(2)) {
  const parsed = parseArguments(argv);
  if (argv.length === 0 || parsed.flags.help) return printHelp();
  if (parsed.flags.version) return console.log(version);
  if (parsed.flags.all && parsed.productQuery) {
    throw new Error("Option --all cannot be combined with a product");
  }
  if (!parsed.flags.all && !parsed.productQuery) {
    throw new Error("Specify a product or use --all");
  }

  const inventory = await fetchVoucherInventory({ sourceUrl: sourceUrl(parsed.flags.source) });
  const selected: readonly Product[] = parsed.productQuery
    ? [requireProduct(parsed.productQuery)]
    : products;
  const result = selected.map((product) => productResult(product, inventory));

  if (parsed.flags.json) {
    console.log(JSON.stringify({ products: result }, null, 2));
    return;
  }

  const rows = result.flatMap((product) => (
    product.codes.length > 0
      ? product.codes.map((code) => [product.name, product.slug, code])
      : [[product.name, product.slug, "(none)"]]
  ));
  renderTable(["PRODUCT", "SLUG", "CODE"], rows);
}
