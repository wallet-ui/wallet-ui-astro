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

## Current scope

This repo is the new public home for the Wallet UI docs migration away from the legacy Next.js + Fumadocs site.

Temporary preview deploy target:

- https://wallet-ui-astro.colmena.dev

The current baseline includes:

- Starlight/Tailwind scaffold
- Catppuccin Mocha theme wiring
- Wallet UI branding assets
- Minimal placeholder content for the migration phase

## Deployment

The site is intended to deploy as a static container using `ghcr.io/beeman/static-server`.

Flow:

- GitHub Actions builds the Astro site into `dist/`
- a container image is published to GHCR
- Dokploy pulls the image and serves it on `wallet-ui-astro.colmena.dev`

## Next steps

- Port the existing documentation content
- Rebuild Fumadocs-specific UI pieces with Starlight-compatible components
- Recreate navigation and search intentionally instead of copying framework glue
