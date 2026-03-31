// @ts-check
import catppuccin from '@catppuccin/starlight';
import cloudflare from '@astrojs/cloudflare';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import { redirects } from './src/redirects.mjs';
import {
	defaultSocialImageAlt,
	defaultSocialImagePath,
	siteDescription,
	siteName,
	siteUrl,
} from './src/site-meta.mjs';
import { socialImageHeight, socialImageWidth } from './src/og-image';
import { docsSidebar } from './src/sidebar.mjs';

export default defineConfig({
	site: siteUrl,
	output: 'server',
	adapter: cloudflare({
		imageService: 'compile',
		prerenderEnvironment: 'node',
	}),
	integrations: [
		starlight({
			title: siteName,
			description: siteDescription,
			favicon: '/favicon.ico',
			logo: {
				src: './src/assets/wallet-ui.png',
				alt: 'Wallet UI',
			},
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/wallet-ui/wallet-ui' }],
			sidebar: docsSidebar,
			head: [
				{
					tag: 'meta',
					attrs: {
						name: 'robots',
						content: 'noindex, nofollow',
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:image',
						content: new URL(defaultSocialImagePath, siteUrl).toString(),
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:image:alt',
						content: defaultSocialImageAlt,
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:image:width',
						content: String(socialImageWidth),
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:image:height',
						content: String(socialImageHeight),
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'twitter:image',
						content: new URL(defaultSocialImagePath, siteUrl).toString(),
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'twitter:image:alt',
						content: defaultSocialImageAlt,
					},
				},
				{
					tag: 'script',
					content:
						"try { if (!localStorage.getItem('starlight-theme')) localStorage.setItem('starlight-theme', 'dark'); } catch {}",
				},
			],
			plugins: [
				catppuccin({
					dark: { flavor: 'mocha' },
					light: { flavor: 'latte' },
				}),
			],
			customCss: ['./src/styles/global.css'],
			routeMiddleware: './src/starlight-route-data.ts',
		}),
	],
	redirects,
	vite: {
		plugins: [tailwindcss()],
	},
});
