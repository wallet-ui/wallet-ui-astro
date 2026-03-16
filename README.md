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

The current baseline includes:

- Starlight/Tailwind scaffold
- Catppuccin Mocha theme wiring
- Wallet UI branding assets
- Minimal placeholder content for the migration phase

## Next steps

- Port the existing documentation content
- Rebuild Fumadocs-specific UI pieces with Starlight-compatible components
- Recreate navigation and search intentionally instead of copying framework glue
