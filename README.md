# Wallet UI Docs

Documentation site for Wallet UI.

## Live site

- https://wallet-ui-astro.wallet-ui.workers.dev

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
pnpm deploy
```

## Current baseline

The site currently includes:

- Wallet UI docs content
- branded assets and social previews
- Cloudflare Web Analytics
- Cloudflare Worker observability

## Social previews

Docs pages include social preview metadata and generated share images.

## Deployment

The site is deployed on Cloudflare Workers.

Deployment ownership is Cloudflare-side:

- Cloudflare Workers Builds should connect this GitHub repository and deploy the configured production branch
- GitHub Actions in this repo are CI only: install, `pnpm check`, `pnpm build`, and a safe Wrangler dry-run validation
- `pnpm deploy` is an authenticated manual Wrangler deploy, not the normal day-to-day deployment path

## Analytics

Cloudflare Web Analytics is enabled when this env var is set in the Cloudflare build environment:

```bash
PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN=<cloudflare-web-analytics-site-token>
```

### Cloudflare setup

1. In Cloudflare, create or open the Web Analytics site for the target hostname.
2. Copy the site token from the Cloudflare Web Analytics snippet.
3. Set `PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN` in the Cloudflare build/deploy environment for this project.
4. Deploy the site and confirm pageviews begin appearing in Cloudflare Web Analytics.

## Worker observability

Worker observability is enabled in `wrangler.toml`:

```toml
[observability]
enabled = true
```

This keeps request/error telemetry enabled at the Worker level from repo config.

## Cloudflare setup

1. Connect this repository to the target Cloudflare account.
2. Use the Worker service name `wallet-ui-astro`.
3. Configure the production branch for the Worker build.
4. Confirm the deployed site is live at `https://wallet-ui-astro.wallet-ui.workers.dev`.
5. If a custom hostname is added later, bind it to the same Worker in Cloudflare and proxy its DNS record.

## Next steps

- Continue expanding and refining the docs content
- Improve navigation, search, and docs ergonomics where needed
- Keep deployment and observability setup concise and current
