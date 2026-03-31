---
title: Site status
description: The current list of known unfinished items in the Astro docs site.
---

Use this page as the working tracker for the Astro docs site. It should reflect the current known unfinished items in this repo and nothing else.

## What is already in place

- [React SDK docs](/react/)
- [React Native SDK docs](/react-native/) for both `@wallet-ui/react-native-kit` and `@wallet-ui/react-native-web3js`
- [Core docs](/core/)
- Sidebar generation from the migrated `meta.json` structure
- Section landing pages for the main SDK entry points
- Legacy `/docs/...` redirects into the current route structure
- **Astro 6**
- **Starlight**
- **Tailwind CSS**
- **Catppuccin for Starlight** using the **Mocha** flavor
- **Starlight/Pagefind search** for static docs search

## Remaining demo follow-ups

These pages still need their interactive demos ported, even though the API docs and source examples are already live:

- `/react/hooks/use-wallet-ui-sign-and-send/` — embedded demo still pending ([issue #10](https://github.com/wallet-ui/wallet-ui-astro/issues/10): `docs(demos): capture deferred hook demo candidates`)
- `/react/hooks/use-wallet-ui-signer/` — embedded demo still pending ([issue #10](https://github.com/wallet-ui/wallet-ui-astro/issues/10): `docs(demos): capture deferred hook demo candidates`)

## Remaining site work

These items are still intentionally unfinished or need follow-up work in the Astro site:

- [Issue #11](https://github.com/wallet-ui/wallet-ui-astro/issues/11): restore Open Graph image parity
- [Issue #12](https://github.com/wallet-ui/wallet-ui-astro/issues/12): restore Sentry and analytics parity
- [Issue #13](https://github.com/wallet-ui/wallet-ui-astro/issues/13): run a broader QA pass for broken links, missing assets, and formatting issues across the docs
- [Issue #14](https://github.com/wallet-ui/wallet-ui-astro/issues/14): continue polishing the information architecture and homepage

## Notes

This page should stay in sync with the actual remaining follow-up items in the Astro site. When an item is done, remove it here in the same change.
