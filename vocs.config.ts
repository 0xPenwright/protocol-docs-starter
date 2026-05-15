import { defineConfig } from "vocs";

export default defineConfig({
  // ───── Identity (CHANGE THESE WHEN YOU FORK) ──────────────────────────
  title:       "Acme Protocol",
  description: "Decentralized lending built on Base. Fast, audited, open-source.",
  iconUrl:     "/logo-mark.svg",
  ogImageUrl:  "/og-default.png",

  // ───── Branding ───────────────────────────────────────────────────────
  theme: {
    accentColor: { light: "#5d3fd3", dark: "#a78bfa" },
    variables: {
      color: {
        background:       { light: "#ffffff", dark: "#0c0c0e" },
        backgroundDark:   { light: "#f6f6f7", dark: "#08080a" },
        codeBlockBackground: { light: "#f8f8f9", dark: "#101013" },
      },
    },
  },

  // ───── Navigation ─────────────────────────────────────────────────────
  topNav: [
    { text: "Docs",    link: "/quickstart" },
    { text: "API",     link: "/reference/api" },
    { text: "Examples", link: "/examples/read-balance" },
    { text: "GitHub",  link: "https://github.com/0xPenwright/protocol-docs-starter" },
  ],

  sidebar: [
    {
      text: "Getting started",
      items: [
        { text: "Introduction", link: "/" },
        { text: "Quickstart",   link: "/quickstart" },
        { text: "Installation", link: "/installation" },
      ],
    },
    {
      text: "Examples",
      items: [
        { text: "Read a balance",       link: "/examples/read-balance" },
        { text: "Send a transaction",   link: "/examples/send-transaction" },
        { text: "Listen to events",     link: "/examples/listen-to-events" },
      ],
    },
    {
      text: "Reference",
      items: [
        { text: "API (auto-generated)", link: "/reference/api" },
      ],
    },
  ],

  socials: [
    { icon: "github",  link: "https://github.com/0xPenwright/protocol-docs-starter" },
    { icon: "x",       link: "https://x.com/0xPenwright" },
  ],

  // ───── GitHub Pages base path (e.g. /protocol-docs-starter/) ──────────
  basePath: process.env.BASE_PATH ?? "",
});
