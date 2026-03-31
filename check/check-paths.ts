import { collectNewPaths } from './collect-new-paths';
import { collectOldPaths } from './collect-old-paths';
import type { ComparisonReport, HttpCheckResult } from './types';
import {
  getBooleanArg,
  getContentEntries,
  getStringArg,
  parseArgs,
  resolveNewRepoRoot,
  resolveOldRepoRoot,
  toJson,
  uniqueSorted,
  writeOutput,
} from './utils';

type Mode = 'all' | 'inventory' | 'tbd' | 'tbd-source' | 'tbd-http' | 'http';

const DEFAULT_MODE: Mode = 'all';
const ALLOWED_MODES = new Set<Mode>(['all', 'inventory', 'tbd', 'tbd-source', 'tbd-http', 'http']);

function normalizeMode(value: string | undefined): Mode {
  if (!value) return DEFAULT_MODE;
  if (ALLOWED_MODES.has(value as Mode)) return value as Mode;
  throw new Error(`Unsupported mode: ${value}`);
}

function shouldRunHttp(mode: Mode): boolean {
  return mode === 'all' || mode === 'http' || mode === 'tbd' || mode === 'tbd-http';
}

function shouldReportTbdSource(mode: Mode): boolean {
  return mode === 'all' || mode === 'tbd' || mode === 'tbd-source';
}

async function checkPath(baseLabel: 'old' | 'new', baseUrl: string, routePath: string): Promise<HttpCheckResult> {
  const url = new URL(routePath, baseUrl).toString();

  try {
    let response = await fetch(url, {
      method: 'HEAD',
      redirect: 'manual',
    });

    if (response.status === 405 || response.status === 501) {
      response = await fetch(url, {
        method: 'GET',
        redirect: 'manual',
      });
    }

    return {
      baseLabel,
      baseUrl,
      path: routePath,
      url,
      ok: response.status >= 200 && response.status < 400,
      status: response.status,
      location: response.headers.get('location'),
    };
  } catch (error) {
    return {
      baseLabel,
      baseUrl,
      path: routePath,
      url,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  async function runWorker(): Promise<void> {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await worker(items[currentIndex]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => runWorker()));
  return results;
}

export async function buildReport(options: {
  oldRepoRoot?: string;
  newRepoRoot?: string;
  oldBaseUrl?: string;
  newBaseUrl?: string;
  mode?: Mode;
  concurrency?: number;
} = {}): Promise<ComparisonReport> {
  const oldInventory = await collectOldPaths(options.oldRepoRoot || resolveOldRepoRoot());
  const newInventory = await collectNewPaths(options.newRepoRoot || resolveNewRepoRoot());
  const oldBaseUrl = options.oldBaseUrl || oldInventory.defaultBaseUrl;
  const newBaseUrl = options.newBaseUrl || newInventory.defaultBaseUrl;
  const oldSourceEntries = getContentEntries(oldInventory.entries);
  const newContentEntries = getContentEntries(newInventory.entries);
  const oldSourcePaths = uniqueSorted(oldSourceEntries.map(entry => entry.path));
  const oldKnownPaths = uniqueSorted(oldInventory.entries.map(entry => entry.path));
  const newCanonicalPaths = uniqueSorted(newContentEntries.map(entry => entry.path));
  const newRouteKeys = new Set(newContentEntries.map(entry => entry.routeKey));
  const tbdInSource = uniqueSorted(
    oldSourceEntries.filter(entry => !newRouteKeys.has(entry.routeKey)).map(entry => entry.path),
  );

  const report: ComparisonReport = {
    generatedAt: new Date().toISOString(),
    oldInventory,
    newInventory,
    oldSourcePaths,
    oldKnownPaths,
    newCanonicalPaths,
    tbdInSource,
    sourceCoverage: {
      matchedCount: oldSourceEntries.length - tbdInSource.length,
      missingCount: tbdInSource.length,
    },
  };

  if (!shouldRunHttp(options.mode || DEFAULT_MODE)) {
    return report;
  }

  if (!oldBaseUrl || !newBaseUrl) {
    throw new Error('HTTP mode requires both old and new base URLs or derivable defaults.');
  }

  const pathsToCheck = oldKnownPaths;
  const concurrency = Math.max(1, options.concurrency || 8);
  const [oldResults, newResults] = await Promise.all([
    mapWithConcurrency(pathsToCheck, concurrency, routePath => checkPath('old', oldBaseUrl, routePath)),
    mapWithConcurrency(pathsToCheck, concurrency, routePath => checkPath('new', newBaseUrl, routePath)),
  ]);

  report.httpChecks = {
    oldBaseUrl,
    newBaseUrl,
    oldResults,
    newResults,
    missingOnNew: uniqueSorted(newResults.filter(result => !result.ok).map(result => result.path)),
  };

  return report;
}

function formatSummary(report: ComparisonReport, mode: Mode): string {
  const lines = [
    `Generated: ${report.generatedAt}`,
    `Old source paths: ${report.oldSourcePaths.length}`,
    `Old known paths: ${report.oldKnownPaths.length}`,
    `New canonical paths: ${report.newCanonicalPaths.length}`,
  ];

  if (shouldReportTbdSource(mode)) {
    lines.push(`TBD in source: ${report.tbdInSource.length}`);
    if (report.tbdInSource.length > 0) {
      lines.push(`  ${report.tbdInSource.join(', ')}`);
    }
  }

  if (report.httpChecks) {
    lines.push(`Old base: ${report.httpChecks.oldBaseUrl}`);
    lines.push(`New base: ${report.httpChecks.newBaseUrl}`);
    lines.push(`Missing on new HTTP: ${report.httpChecks.missingOnNew.length}`);
    if (report.httpChecks.missingOnNew.length > 0) {
      lines.push(`  ${report.httpChecks.missingOnNew.join(', ')}`);
    }
  }

  return lines.join('\n');
}

function selectOutputForMode(report: ComparisonReport, mode: Mode) {
  if (mode === 'inventory') {
    return {
      generatedAt: report.generatedAt,
      oldSourcePaths: report.oldSourcePaths,
      oldKnownPaths: report.oldKnownPaths,
      newCanonicalPaths: report.newCanonicalPaths,
    };
  }

  if (mode === 'tbd-source') {
    return {
      generatedAt: report.generatedAt,
      tbdInSource: report.tbdInSource,
      sourceCoverage: report.sourceCoverage,
    };
  }

  if (mode === 'tbd-http' || mode === 'http') {
    return {
      generatedAt: report.generatedAt,
      httpChecks: report.httpChecks,
    };
  }

  if (mode === 'tbd') {
    return {
      generatedAt: report.generatedAt,
      tbdInSource: report.tbdInSource,
      sourceCoverage: report.sourceCoverage,
      httpChecks: report.httpChecks,
    };
  }

  return report;
}

if (import.meta.main) {
  const args = parseArgs(process.argv.slice(2));
  const mode = normalizeMode(getStringArg(args, 'mode'));
  const outputPath = getStringArg(args, 'output');
  const jsonMode = getBooleanArg(args, 'json');
  const concurrencyValue = getStringArg(args, 'concurrency');
  const report = await buildReport({
    mode,
    concurrency: concurrencyValue ? Number(concurrencyValue) : undefined,
    oldRepoRoot: getStringArg(args, 'old-repo-root'),
    newRepoRoot: getStringArg(args, 'new-repo-root'),
    oldBaseUrl: getStringArg(args, 'old-base'),
    newBaseUrl: getStringArg(args, 'new-base'),
  });
  const selectedOutput = selectOutputForMode(report, mode);

  if (outputPath) {
    await writeOutput(outputPath, toJson(selectedOutput));
  }

  if (jsonMode || outputPath) {
    console.log(toJson(selectedOutput));
  } else {
    console.log(formatSummary(report, mode));
  }
}
