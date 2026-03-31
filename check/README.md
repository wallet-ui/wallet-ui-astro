# Migration QA Checkers

Source-derived Bun + TypeScript tooling for comparing legacy Wallet UI docs routes against the Astro docs rebuild.

## Commands

```bash
bun check/collect-old-paths.ts --json
bun check/collect-new-paths.ts --json
bun check/check-paths.ts --mode inventory
bun check/check-paths.ts --mode tbd
bun check/check-paths.ts --old-base https://wallet-ui.dev --new-base https://wallet-ui-astro.wallet-ui.workers.dev
```

## What "TBD" means

- `tbdInSource`: legacy source-backed docs paths that exist in `/home/obrera/projects/wallet-ui/docs/content/docs` but do not have a matching normalized docs page in `src/content/docs` in this repo.
- `httpChecks.missingOnNew`: legacy paths that fail with a non-`2xx`/`3xx` response when requested against the new base URL. This includes missing redirects.

## Notes

- Legacy inventories include explicit redirects from the old repo `next.config.mjs` in addition to source-backed docs pages.
- New inventories use the Astro docs content structure in `src/content/docs`, where `index.mdx` becomes the section root and the site no longer uses the `/docs` prefix for canonical routes.
- Defaults are derived from repo config when available:
  - old base from `../wallet-ui/docs/src/site-config.ts`
  - new base from `./astro.config.mjs`
