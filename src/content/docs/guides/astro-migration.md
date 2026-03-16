---
title: Astro migration status
description: Current migration status for the new Wallet UI docs site.
---

The new docs site is now running on:

- **Astro 6**
- **Starlight**
- **Tailwind CSS**
- **Catppuccin for Starlight** using the **Mocha** flavor
- **Starlight/Pagefind search** for static docs search

## What has moved over

- React docs
- React Native docs for both `@wallet-ui/react-native-kit` and `@wallet-ui/react-native-web3js`
- Core docs
- Sidebar generation from the migrated `meta.json` structure
- Section root landing pages for `/react/` and `/react-native/`

## What is intentionally deferred

- OG image generation parity with the old site
- Sentry and analytics parity
- React Native package dedupe work in the source monorepo

## Immediate next steps

1. Run a broader QA pass for broken links, missing assets, and formatting issues across the migrated docs.
2. Continue polishing the information architecture and homepage now that the real content is in place.
3. Plan the eventual `wallet-ui.dev` cutover once the Astro preview is stable enough.

## Notes

This guide is now a real migration tracker rather than a bootstrap placeholder.
