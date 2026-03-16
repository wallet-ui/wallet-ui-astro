---
title: Migration status
description: What has already moved into the Astro docs site and what is still deferred.
---

Use this page to understand the current scope of the Astro docs site. It is a status page for the docs migration, not a substitute for the published SDK docs.

## Current platform

- **Astro 6**
- **Starlight**
- **Tailwind CSS**
- **Catppuccin for Starlight** using the **Mocha** flavor
- **Starlight/Pagefind search** for static docs search

## What has moved over

- [React SDK docs](/react/)
- [React Native SDK docs](/react-native/) for both `@wallet-ui/react-native-kit` and `@wallet-ui/react-native-web3js`
- [Core docs](/core/)
- Sidebar generation from the migrated `meta.json` structure
- Section landing pages for the main SDK entry points

## What is intentionally deferred

- OG image generation parity with the old site
- Sentry and analytics parity
- React Native package dedupe work in the source monorepo

## Immediate next steps

1. Run a broader QA pass for broken links, missing assets, and formatting issues across the migrated docs.
2. Continue polishing the information architecture and homepage now that the real content is in place.
3. Plan the eventual `wallet-ui.dev` cutover once the Astro preview is stable enough.

## Notes

Treat this page as an operational tracker. For product documentation, start from the relevant SDK overview page instead.
