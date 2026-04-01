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

## Social previews

Docs pages now get prerendered social cards generated from each entry's title and description.

- Starlight route middleware normalizes page-level `og:title`, `og:description`, `twitter:title`, and `twitter:description` values from each docs entry.
- Build-time Astro endpoints under `src/pages/og/` render per-doc PNG cards with `sharp`, which keeps the deployed Worker simple because image rendering happens during the build, not at request time.
- The shared `public/og.png` remains as the site-wide fallback for any non-doc route metadata.

## Deployment

The site targets Cloudflare Workers through Astro's Cloudflare adapter and Wrangler.

## Analytics

This repo uses Cloudflare Web Analytics via the standard beacon script when a token is provided at build time.

### Env var

```bash
PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN=<cloudflare-web-analytics-site-token>
```

### How it works

- if `PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN` is set, Astro injects the Cloudflare beacon script into the site head during build
- if the env var is unset, no analytics script is added
- this keeps analytics configuration explicit and environment-driven instead of hardcoding a token in the repo

### Cloudflare setup

1. In Cloudflare, create or open the Web Analytics site for the target hostname.
2. Copy the site token from the Cloudflare Web Analytics snippet.
3. Set `PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN` in the Cloudflare build/deploy environment for this project.
4. Deploy the site and confirm pageviews begin appearing in Cloudflare Web Analytics.

If the final hostname is proxied through Cloudflare, Cloudflare can also auto-inject analytics from the dashboard. We still support the env-driven snippet path so deployment behavior stays explicit in repo setup and preview environments.

## Worker observability

Wrangler enables Cloudflare Worker observability directly in `wrangler.toml`:

```toml
[observability]
enabled = true
```

This keeps request/error telemetry enabled at the Worker level from repo config instead of relying on a one-off dashboard toggle.

Why this path:

- it preserves the existing Starlight docs behavior and Astro redirects
- it keeps the current temporary live URL and noindex posture intact
- it supports prerendered per-page OG image assets without adding runtime rendering complexity to the Worker

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
5. If a custom hostname is added later, bind it to the same Worker in Cloudflare and proxy its DNS record.
6. Confirm the deployed site still serves `robots.txt` with `Disallow: /`.

## Next steps

- Port the existing documentation content
- Rebuild Fumadocs-specific UI pieces with Starlight-compatible components
- Recreate navigation and search intentionally instead of copying framework glue
