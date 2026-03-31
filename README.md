# Wallet UI Astro Docs

Astro 6 + Starlight + Tailwind starter for the Wallet UI documentation rebuild.

## Stack

- Astro 6
- Starlight
- Tailwind CSS v4
- Catppuccin for Starlight using the Mocha flavor

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

`pnpm preview` runs the Worker locally through Wrangler after a build. `pnpm dev` remains the standard Astro dev server.

## Current scope

This repo is the new public home for the Wallet UI docs migration away from the legacy Next.js + Fumadocs site.

Current live temporary site:

- https://wallet-ui-astro.wallet-ui.workers.dev

The current baseline includes:

- Starlight/Tailwind scaffold
- Catppuccin Mocha theme wiring
- Wallet UI branding assets
- Minimal placeholder content for the migration phase

## Deployment

The site targets Cloudflare Workers through Astro's Cloudflare adapter and Wrangler.

Why this path:

- it preserves the existing Starlight docs behavior and Astro redirects
- it keeps the current temporary live URL and noindex posture intact
- it is the simplest deploy target that still leaves room for future server-side features such as OG image generation

Deployment ownership is Cloudflare-side:

- Cloudflare Workers Builds should connect this GitHub repository and perform deploys for the configured production branch
- GitHub Actions in this repo are CI only: install, `pnpm check`, `pnpm build`, and a safe Wrangler dry-run validation
- repository deploy secrets are not required for the normal deployment path

Local Wrangler commands:

```bash
pnpm build
pnpm preview
pnpm deploy
```

`pnpm deploy` is an authenticated manual Wrangler deploy, not the intended day-to-day deployment mechanism for this repo.

## Manual Cloudflare Setup

Cloudflare-side wiring still needs to be completed after this PR lands:

1. In Cloudflare Workers Builds / GitHub integration, connect this repository to the target Cloudflare account.
2. Create or select the Worker with the exact name `wallet-ui-astro` so it matches the `name` value in `wrangler.toml`. If the dashboard Worker name does not match that field, builds will target the wrong Worker.
3. Configure the production branch for the Worker build in Cloudflare.
4. Confirm the deployed Worker is live at `https://wallet-ui-astro.wallet-ui.workers.dev`.
5. Confirm the deployed site still serves `robots.txt` with `Disallow: /`.

## Next steps

- Port the existing documentation content
- Rebuild Fumadocs-specific UI pieces with Starlight-compatible components
- Recreate navigation and search intentionally instead of copying framework glue
