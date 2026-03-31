import fs from 'node:fs/promises';
import path from 'node:path';
import type { RouteEntry, RouteInventory } from './types';

export const DEFAULT_OLD_REPO_ROOT = '/home/obrera/projects/wallet-ui/docs';
export const DEFAULT_NEW_REPO_ROOT = '/home/obrera/projects/wallet-ui-astro';
export const LEGACY_DOCS_PREFIX = '/docs';

const DOC_FILE_PATTERN = /\.(md|mdx)$/;

export function resolveOldRepoRoot(): string {
  return process.env.OLD_DOCS_REPO_ROOT || DEFAULT_OLD_REPO_ROOT;
}

export function resolveNewRepoRoot(): string {
  return process.env.NEW_DOCS_REPO_ROOT || process.cwd() || DEFAULT_NEW_REPO_ROOT;
}

export function toPosix(value: string): string {
  return value.split(path.sep).join('/');
}

export function normalizeRouteKey(value: string): string {
  return value.replace(/^\/+|\/+$/g, '');
}

export function slugFromRelativeDocPath(relativePath: string): string {
  const withoutExtension = relativePath.replace(DOC_FILE_PATTERN, '');
  return normalizeRouteKey(withoutExtension.replace(/\/index$/, ''));
}

export function legacyPathFromRouteKey(routeKey: string): string {
  return routeKey ? `${LEGACY_DOCS_PREFIX}/${routeKey}` : LEGACY_DOCS_PREFIX;
}

export function canonicalPathFromRouteKey(routeKey: string): string {
  return routeKey ? `/${routeKey}` : '/';
}

export function legacyPathToRouteKey(legacyPath: string): string {
  const normalized = normalizeRouteKey(legacyPath);
  if (normalized === 'docs') return '';
  return normalized.startsWith('docs/') ? normalized.slice('docs/'.length) : normalized;
}

export async function listDocFiles(root: string): Promise<string[]> {
  const results: string[] = [];

  async function walk(currentDir: string): Promise<void> {
    const dirents = await fs.readdir(currentDir, { withFileTypes: true });

    for (const dirent of dirents) {
      const absolutePath = path.join(currentDir, dirent.name);

      if (dirent.isDirectory()) {
        await walk(absolutePath);
        continue;
      }

      if (!dirent.isFile()) continue;
      if (!DOC_FILE_PATTERN.test(dirent.name)) continue;

      results.push(toPosix(path.relative(root, absolutePath)));
    }
  }

  await walk(root);
  results.sort();
  return results;
}

export async function readFileUtf8(filePath: string): Promise<string> {
  return fs.readFile(filePath, 'utf8');
}

export async function writeOutput(filePath: string, contents: string): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, contents, 'utf8');
}

export async function deriveSiteUrl(configPath: string, pattern: RegExp): Promise<string | undefined> {
  try {
    const source = await readFileUtf8(configPath);
    return source.match(pattern)?.[1];
  } catch {
    return undefined;
  }
}

export async function deriveOldBaseUrl(oldRepoRoot: string): Promise<string | undefined> {
  return deriveSiteUrl(path.join(oldRepoRoot, 'src/site-config.ts'), /url:\s*'([^']+)'/);
}

export async function deriveNewBaseUrl(newRepoRoot: string): Promise<string | undefined> {
  return deriveSiteUrl(path.join(newRepoRoot, 'astro.config.mjs'), /site:\s*'([^']+)'/);
}

export function uniqueSorted(values: Iterable<string>): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export function toJson(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

export function summarizeInventory(inventory: RouteInventory): string[] {
  const contentCount = inventory.entries.filter(entry => entry.kind === 'content').length;
  const redirectCount = inventory.entries.filter(entry => entry.kind === 'redirect').length;

  return [
    `${inventory.repo} inventory`,
    `  repo root: ${inventory.repoRoot}`,
    `  docs root: ${inventory.docsRoot}`,
    `  default base: ${inventory.defaultBaseUrl ?? 'n/a'}`,
    `  content paths: ${contentCount}`,
    `  redirects: ${redirectCount}`,
  ];
}

export function getContentEntries(entries: RouteEntry[]): RouteEntry[] {
  return entries.filter(entry => entry.kind === 'content');
}

export function getRedirectEntries(entries: RouteEntry[]): RouteEntry[] {
  return entries.filter(entry => entry.kind === 'redirect');
}

export function parseArgs(argv: string[]): Map<string, string | boolean> {
  const args = new Map<string, string | boolean>();

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;

    const [rawKey, inlineValue] = token.slice(2).split('=', 2);
    if (inlineValue !== undefined) {
      args.set(rawKey, inlineValue);
      continue;
    }

    const nextToken = argv[index + 1];
    if (!nextToken || nextToken.startsWith('--')) {
      args.set(rawKey, true);
      continue;
    }

    args.set(rawKey, nextToken);
    index += 1;
  }

  return args;
}

export function getStringArg(args: Map<string, string | boolean>, key: string): string | undefined {
  const value = args.get(key);
  return typeof value === 'string' ? value : undefined;
}

export function getBooleanArg(args: Map<string, string | boolean>, key: string): boolean {
  return args.get(key) === true;
}
