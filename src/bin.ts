#!/usr/bin/env bun

import { main } from "./cli";

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`netcup: ${message}`);
  process.exitCode = 1;
});
