#!/usr/bin/env tsx
/**
 * Parse Solidity sources in contracts/ and emit a Markdown API reference at
 *   docs/pages/reference/api.mdx
 *
 * Recognised NatSpec tags: @title, @notice, @dev, @param, @return.
 * Only `external` and `public` functions and events are included.
 *
 * This is a deliberately small parser, ~150 lines. For larger protocols swap
 * in `solidity-docgen` and point its template at the same output path.
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from "node:fs";
import { join, basename, extname } from "node:path";

const CONTRACTS_DIR = "contracts";
const OUTPUT_PATH   = "docs/pages/reference/api.mdx";

interface NatSpec {
  notice?: string;
  dev?: string;
  params: Record<string, string>;
  returns: Record<string, string>;
}

interface Member {
  kind:       "function" | "event";
  signature:  string;
  name:       string;
  visibility: string;
  natSpec:    NatSpec;
}

interface Contract {
  name:    string;
  title?:  string;
  notice?: string;
  members: Member[];
}

function parseNatSpec(block: string): NatSpec {
  const ns: NatSpec = { params: {}, returns: {} };
  // Strip comment markers and collect non-empty lines.
  const lines = block
    .split("\n")
    .map((l) => l.replace(/^\s*(\/\*\*|\*\/|\/\/\/?|\*)\s?/, "").trim())
    .filter((l) => l.length > 0);

  // Group consecutive lines under the most recent @tag.
  type Group = { tag: string; text: string };
  const groups: Group[] = [];
  for (const line of lines) {
    const m = line.match(/^@(\w+)\s*(.*)$/);
    if (m) {
      groups.push({ tag: m[1], text: m[2] });
    } else if (groups.length > 0) {
      groups[groups.length - 1].text += " " + line;
    }
  }

  for (const { tag, text } of groups) {
    const t = text.trim();
    if (tag === "notice") ns.notice = t;
    else if (tag === "dev") ns.dev = t;
    else if (tag === "param") {
      const m = t.match(/^(\w+)\s+(.*)$/);
      if (m) ns.params[m[1]] = m[2].trim();
    } else if (tag === "return") {
      const m = t.match(/^(\w+)\s+(.*)$/);
      if (m) ns.returns[m[1]] = m[2].trim();
      else ns.returns["_"] = t;
    }
  }
  return ns;
}

function parseContract(source: string): Contract | null {
  const m = source.match(/contract\s+(\w+)/);
  if (!m) return null;
  const contractName = m[1];

  // Header NatSpec immediately preceding the contract declaration.
  const headerMatch = source.match(/(\/\*\*[\s\S]*?\*\/|(?:[ \t]*\/\/\/[^\n]*\n)+)\s*contract\s+\w+/);
  const headerNs = headerMatch ? parseNatSpec(headerMatch[1]) : { params: {}, returns: {} };
  const titleMatch = headerMatch?.[1].match(/@title\s+(.*)/);

  // Functions and events with their preceding NatSpec.
  // Each /// line may be indented, so allow leading whitespace inside the
  // repeated group.
  const memberRe = /(\/\*\*[\s\S]*?\*\/|(?:[ \t]*\/\/\/[^\n]*\n)+)\s*(function|event)\s+(\w+)\s*\(([^)]*)\)([^;{]*)[;{]/g;
  const members: Member[] = [];
  let mm: RegExpExecArray | null;
  while ((mm = memberRe.exec(source))) {
    const [, doc, kind, name, args, tail] = mm;
    const visibility = tail.match(/\b(external|public|internal|private)\b/)?.[1] ?? "external";
    if (kind === "function" && visibility !== "external" && visibility !== "public") continue;
    const signature = `${kind} ${name}(${args.trim()})${tail.trim() ? " " + tail.trim() : ""}`;
    members.push({
      kind:       kind as "function" | "event",
      signature,
      name,
      visibility,
      natSpec:    parseNatSpec(doc),
    });
  }

  return {
    name:    contractName,
    title:   titleMatch?.[1],
    notice:  headerNs.notice,
    members,
  };
}

function renderContract(c: Contract): string {
  const out: string[] = [];
  out.push(`## ${c.title ?? c.name}\n`);
  if (c.notice) out.push(`${c.notice}\n`);

  for (const m of c.members) {
    out.push(`### \`${m.name}\``);
    out.push("");
    out.push("```solidity");
    out.push(m.signature.replace(/\s+/g, " ").trim());
    out.push("```");
    out.push("");
    if (m.natSpec.notice) out.push(m.natSpec.notice);
    if (m.natSpec.dev) {
      out.push("");
      out.push(`:::note[Implementation note]\n${m.natSpec.dev}\n:::`);
    }
    if (Object.keys(m.natSpec.params).length) {
      out.push("");
      out.push("**Parameters**");
      out.push("");
      out.push("| Name | Description |");
      out.push("|---|---|");
      for (const [k, v] of Object.entries(m.natSpec.params)) out.push(`| \`${k}\` | ${v} |`);
    }
    if (Object.keys(m.natSpec.returns).length) {
      out.push("");
      out.push("**Returns**");
      out.push("");
      out.push("| Name | Description |");
      out.push("|---|---|");
      for (const [k, v] of Object.entries(m.natSpec.returns)) out.push(`| \`${k}\` | ${v} |`);
    }
    out.push("");
  }
  return out.join("\n");
}

function main() {
  if (!existsSync(CONTRACTS_DIR)) {
    console.error(`No ${CONTRACTS_DIR}/ directory found.`);
    process.exit(1);
  }
  const files = readdirSync(CONTRACTS_DIR)
    .filter((f) => extname(f) === ".sol")
    .map((f) => join(CONTRACTS_DIR, f));

  if (!files.length) {
    console.error(`No .sol files in ${CONTRACTS_DIR}/.`);
    process.exit(1);
  }

  const contracts = files
    .map((f) => parseContract(readFileSync(f, "utf8")))
    .filter((c): c is Contract => !!c);

  const header = [
    "---",
    "title: API reference",
    "description: Auto-generated from contract NatSpec. Edit the source, not this file.",
    "---",
    "",
    "# API reference",
    "",
    "> Generated from `contracts/*.sol` via `npm run gen:api`. Do not edit by hand.",
    "",
  ].join("\n");

  const body = contracts.map(renderContract).join("\n");
  mkdirSync("docs/pages/reference", { recursive: true });
  writeFileSync(OUTPUT_PATH, header + body);
  console.log(`Wrote ${OUTPUT_PATH} — ${contracts.length} contract(s), ${contracts.reduce((n, c) => n + c.members.length, 0)} members`);
}

main();
