import { describe, expect, test } from "bun:test";
import { createEmptyVoucherCodeMap } from "../src/inventory";
import {
  renderVoucherBlock,
  updateReadmeVoucherBlock,
  voucherBlockEnd,
  voucherBlockStart,
} from "../scripts/update-readme-vouchers";

const readmeWith = (block: string) => `# netcup\n\n${block}\n\n## Usage\n`;
const repositoryRoot = new URL("../", import.meta.url);

describe("README voucher snapshot", () => {
  test("renders a compact product table with stable code ordering", () => {
    const inventory = createEmptyVoucherCodeMap();
    inventory["root-1000-g12"] = [
      "0000nc2222222222",
      "0000nc1111111111",
    ];

    const block = renderVoucherBlock(inventory, "2026-08-22 06:30 UTC");
    expect(block).toContain("_Last code update: **2026-08-22 06:30 UTC**_");
    expect(block).toContain("| **RS 1000 G12**<br><sub>root-1000-g12</sub>");
    expect(block.indexOf("0000nc1111111111")).toBeLessThan(
      block.indexOf("0000nc2222222222"),
    );
    expect(block).toContain("_None currently available_");
  });

  test("preserves the timestamp and file when the code set is unchanged", () => {
    const inventory = createEmptyVoucherCodeMap();
    inventory["vps-1000-g12"] = ["0000nc1111111111"];
    const original = readmeWith(renderVoucherBlock(inventory, "2026-08-22 00:00 UTC"));

    const result = updateReadmeVoucherBlock(
      original,
      inventory,
      new Date("2026-08-22T06:00:00Z"),
    );
    expect(result).toEqual({ changed: false, readme: original });
  });

  test("removes missing codes and advances the timestamp on a real change", () => {
    const before = createEmptyVoucherCodeMap();
    before["root-1000-g12"] = ["0000nc1111111111"];
    const after = createEmptyVoucherCodeMap();
    after["root-1000-g12"] = ["0000nc2222222222"];
    const original = readmeWith(renderVoucherBlock(before, "2026-08-22 00:00 UTC"));

    const result = updateReadmeVoucherBlock(
      original,
      after,
      new Date("2026-08-22T06:45:12Z"),
    );
    expect(result.changed).toBe(true);
    expect(result.readme).not.toContain("0000nc1111111111");
    expect(result.readme).toContain("0000nc2222222222");
    expect(result.readme).toContain("2026-08-22 06:45 UTC");
  });

  test("refuses to rewrite a README without one exact marker pair", () => {
    const inventory = createEmptyVoucherCodeMap();
    expect(() => updateReadmeVoucherBlock("# netcup", inventory, new Date())).toThrow(
      "exactly one voucher-code marker pair",
    );
    expect(() => updateReadmeVoucherBlock(
      `${voucherBlockStart}\n${voucherBlockStart}\n${voucherBlockEnd}`,
      inventory,
      new Date(),
    )).toThrow("exactly one voucher-code marker pair");
  });

  test("workflow checks every six hours and commits only README changes", async () => {
    const workflow = await Bun.file(new URL(
      ".github/workflows/update-readme-vouchers.yml",
      repositoryRoot,
    )).text();
    expect(workflow).toContain('cron: "23 */6 * * *"');
    expect(workflow).toContain("contents: write");
    expect(workflow).toContain("bun scripts/update-readme-vouchers.ts");
    expect(workflow).toContain("git diff --quiet -- README.md");
    expect(workflow).toContain("git push origin HEAD:main");
  });
});
