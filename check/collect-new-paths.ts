import path from 'node:path';
import type { RouteEntry, RouteInventory } from './types';
import {
  canonicalPathFromRouteKey,
  deriveNewBaseUrl,
  getBooleanArg,
  getStringArg,
  listDocFiles,
  parseArgs,
  resolveNewRepoRoot,
  slugFromRelativeDocPath,
  summarizeInventory,
  toJson,
  uniqueSorted,
  writeOutput,
} from './utils';

export async function collectNewPaths(newRepoRoot = resolveNewRepoRoot()): Promise<RouteInventory> {
  const docsRoot = path.join(newRepoRoot, 'src/content/docs');
  const relativeDocFiles = await listDocFiles(docsRoot);
  const entries: RouteEntry[] = relativeDocFiles.map(relativeDocFile => {
    const routeKey = slugFromRelativeDocPath(relativeDocFile);
    return {
      kind: 'content',
      path: canonicalPathFromRouteKey(routeKey),
      routeKey,
      sourceFile: path.join(docsRoot, relativeDocFile),
    };
  });

  return {
    repo: 'new',
    repoRoot: newRepoRoot,
    docsRoot,
    defaultBaseUrl: await deriveNewBaseUrl(newRepoRoot),
    generatedAt: new Date().toISOString(),
    entries,
  };
}

function toOutput(inventory: RouteInventory) {
  return {
    ...inventory,
    canonicalPaths: uniqueSorted(inventory.entries.map(entry => entry.path)),
  };
}

if (import.meta.main) {
  const args = parseArgs(process.argv.slice(2));
  const newRepoRoot = getStringArg(args, 'new-repo-root') || resolveNewRepoRoot();
  const outputPath = getStringArg(args, 'output');
  const jsonMode = getBooleanArg(args, 'json');
  const inventory = await collectNewPaths(newRepoRoot);
  const output = toOutput(inventory);

  if (outputPath) {
    await writeOutput(outputPath, toJson(output));
  }

  if (jsonMode || outputPath) {
    console.log(toJson(output));
  } else {
    console.log(summarizeInventory(inventory).join('\n'));
    console.log(`  canonical path sample: ${output.canonicalPaths.slice(0, 5).join(', ')}`);
  }
}
