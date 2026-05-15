# protocol-docs-starter

[![deploy docs](https://github.com/0xPenwright/protocol-docs-starter/actions/workflows/deploy.yml/badge.svg)](https://github.com/0xPenwright/protocol-docs-starter/actions/workflows/deploy.yml)
[![test](https://github.com/0xPenwright/protocol-docs-starter/actions/workflows/test.yml/badge.svg)](https://github.com/0xPenwright/protocol-docs-starter/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Opinionated docs starter for Web3 protocols. Fork it, edit five config fields, drop in your Solidity contracts, ship docs that don't suck.

## What this is

- **[Vocs](https://vocs.dev)** — Vite-fast, React-based docs framework (the same toolchain shipping [viem](https://viem.sh) and [wagmi](https://wagmi.sh) docs)
- **NatSpec → MDX generator** — a ~150-line TypeScript parser that turns `@notice` / `@param` / `@return` tags into a reference page on every build
- **Twoslash-typed Viem code blocks** — readers see TypeScript types on hover, the same as in their editor
- **GitHub Pages deploy out of the box** — push to `main`, docs publish automatically

## Live demo

After forking, your site builds to:

```
https://<your-username>.github.io/<your-repo>/
```

A reference fork lives at [0xpenwright.github.io/protocol-docs-starter](https://0xpenwright.github.io/protocol-docs-starter/).

## Quickstart

```bash
gh repo fork 0xPenwright/protocol-docs-starter --clone --remote
cd protocol-docs-starter
npm install --legacy-peer-deps
npm run dev
```

Then edit:

| File | What to change |
|---|---|
| `vocs.config.ts` | Title, description, sidebar, social links, GitHub URL |
| `contracts/*.sol` | Replace `ExampleVault.sol` with your real contracts (keep NatSpec) |
| `docs/pages/index.mdx` | Your landing page |
| `docs/pages/quickstart.mdx` | Your 5-minute integration |
| `docs/pages/examples/*.mdx` | Replace the three Viem snippets with yours |

Run `npm run gen:api` to regenerate `docs/pages/reference/api.mdx` from your contracts. The CI does this on every push.

## What's inside

```
vocs.config.ts                       ← branding, sidebar, basePath
docs/pages/
├── index.mdx                        ← landing page
├── quickstart.mdx                   ← 5-min integration
├── installation.mdx                 ← npm install + chain config
├── examples/
│   ├── read-balance.mdx             ← readContract + multicall
│   ├── send-transaction.mdx         ← approve + writeContract
│   └── listen-to-events.mdx         ← watchEvent + getContractEvents
└── reference/api.mdx                ← auto-generated, do not edit
scripts/generate-api-reference.ts    ← NatSpec parser (150 lines)
contracts/ExampleVault.sol           ← sample contract driving the reference
.github/workflows/
├── deploy.yml                       ← build + deploy to GitHub Pages
└── test.yml                         ← build check on PRs
```

## The NatSpec parser

The generator is intentionally tiny — easier to fork and tweak than to depend on `solidity-docgen` for a small protocol. It handles:

- `@title`, `@notice`, `@dev` at the contract level
- `@notice`, `@dev`, `@param <name>`, `@return <name>` per function or event
- Both `/** ... */` and `///` comment styles
- Multi-line continuations under a tag

Outputs Markdown tables for params and returns and a `:::note` admonition for `@dev` notes. Drop in your contracts and the generator infers names, signatures, and visibility automatically.

For larger protocols (50+ external functions) swap in [`solidity-docgen`](https://github.com/OpenZeppelin/solidity-docgen) — point its output path at `docs/pages/reference/api.mdx` and you're done.

## Deploy

The starter ships a [`deploy docs`](./.github/workflows/deploy.yml) workflow that:

1. Installs deps
2. Regenerates the API reference from your contracts
3. Builds the Vocs site to `docs/dist/`
4. Uploads + deploys via [`actions/deploy-pages`](https://github.com/actions/deploy-pages)

To enable GitHub Pages on your fork:

1. Settings → Pages → Source → **GitHub Actions**
2. Push to `main` — first deploy takes ~2 minutes

The `BASE_PATH` env var is set automatically from the repo name so internal links work for project pages.

## Why not Mintlify, Gitbook, Docusaurus?

- **Mintlify** — beautiful, but production hosting is theirs. Lock-in.
- **Gitbook** — proprietary editor, stale dev experience.
- **Docusaurus** — solid, but heavyweight for small protocols and React 18 specific.

Vocs is built **by the same team behind Viem**. The fork is one config file, the build is sub-30s, the runtime is React. For most protocols of <100 pages, this is the right ceiling.

## Stack

- [Vocs](https://vocs.dev) 1.x
- React 18
- Viem 2.x in code blocks
- Twoslash for type-aware code highlighting
- Node 20+

## License

MIT — see [LICENSE](./LICENSE).

---

**Author:** [0xPenwright](https://github.com/0xPenwright) · [@0xPenwright](https://twitter.com/0xPenwright) · solo Web3 engineer, available for protocol docs revamps, integration work, and Solidity contracts.
