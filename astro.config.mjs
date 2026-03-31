// @ts-check
import catppuccin from '@catppuccin/starlight';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import { redirects } from './src/redirects.mjs';
import { docsSidebar } from './src/sidebar.mjs';

export default defineConfig({
	site: 'https://wallet-ui-astro.colmena.dev',
	integrations: [
		starlight({
			title: 'Wallet UI',
			description: 'Wallet UI is the modern UI for the Wallet Standard.',
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
		}),
	],
	redirects,
	vite: {
		plugins: [tailwindcss()],
	},
});
