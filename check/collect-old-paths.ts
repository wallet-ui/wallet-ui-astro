import path from 'node:path';
import type { RouteEntry, RouteInventory } from './types';
import {
  deriveOldBaseUrl,
  getBooleanArg,
  getStringArg,
  legacyPathFromRouteKey,
  listDocFiles,
  parseArgs,
  readFileUtf8,
  resolveOldRepoRoot,
  slugFromRelativeDocPath,
  summarizeInventory,
  toJson,
  uniqueSorted,
  writeOutput,
} from './utils';

async function collectLegacyRedirects(oldRepoRoot: string): Promise<RouteEntry[]> {
  const nextConfigPath = path.join(oldRepoRoot, 'next.config.mjs');
  const source = await readFileUtf8(nextConfigPath);
  const redirects: RouteEntry[] = [];
  const redirectPattern =
    /source:\s*'([^']+)'\s*,\s*destination:\s*'([^']+)'\s*,\s*permanent:\s*(?:true|false)/gms;

  for (const match of source.matchAll(redirectPattern)) {
    redirects.push({
      kind: 'redirect',
      path: match[1],
      routeKey: '',
      sourceFile: nextConfigPath,
      destination: match[2],
    });
  }

  return redirects.sort((left, right) => left.path.localeCompare(right.path));
}

export async function collectOldPaths(oldRepoRoot = resolveOldRepoRoot()): Promise<RouteInventory> {
  const docsRoot = path.join(oldRepoRoot, 'content/docs');
  const relativeDocFiles = await listDocFiles(docsRoot);
  const contentEntries: RouteEntry[] = relativeDocFiles.map(relativeDocFile => {
    const routeKey = slugFromRelativeDocPath(relativeDocFile);
    return {
      kind: 'content',
      path: legacyPathFromRouteKey(routeKey),
      routeKey,
      sourceFile: path.join(docsRoot, relativeDocFile),
    };
  });
  const redirectEntries = await collectLegacyRedirects(oldRepoRoot);

  return {
    repo: 'old',
    repoRoot: oldRepoRoot,
    docsRoot,
    defaultBaseUrl: await deriveOldBaseUrl(oldRepoRoot),
    generatedAt: new Date().toISOString(),
    entries: [...contentEntries, ...redirectEntries],
  };
}

function toOutput(inventory: RouteInventory) {
  const contentPaths = uniqueSorted(
    inventory.entries.filter(entry => entry.kind === 'content').map(entry => entry.path),
  );
  const redirectPaths = uniqueSorted(
    inventory.entries.filter(entry => entry.kind === 'redirect').map(entry => entry.path),
  );

  return {
    ...inventory,
    contentPaths,
    redirectPaths,
  };
}

if (import.meta.main) {
  const args = parseArgs(process.argv.slice(2));
  const oldRepoRoot = getStringArg(args, 'old-repo-root') || resolveOldRepoRoot();
  const outputPath = getStringArg(args, 'output');
  const jsonMode = getBooleanArg(args, 'json');
  const inventory = await collectOldPaths(oldRepoRoot);
  const output = toOutput(inventory);

  if (outputPath) {
    await writeOutput(outputPath, toJson(output));
  }

  if (jsonMode || outputPath) {
    console.log(toJson(output));
  } else {
    console.log(summarizeInventory(inventory).join('\n'));
    console.log(`  content path sample: ${output.contentPaths.slice(0, 5).join(', ')}`);
    console.log(`  redirect paths: ${output.redirectPaths.join(', ') || 'none'}`);
  }
}
