export type RouteKind = 'content' | 'redirect';

export type RouteEntry = {
  kind: RouteKind;
  path: string;
  routeKey: string;
  sourceFile: string;
  destination?: string;
};

export type RouteInventory = {
  repo: 'old' | 'new';
  repoRoot: string;
  docsRoot: string;
  defaultBaseUrl?: string;
  generatedAt: string;
  entries: RouteEntry[];
};

export type HttpCheckResult = {
  baseLabel: 'old' | 'new';
  baseUrl: string;
  path: string;
  url: string;
  ok: boolean;
  status?: number;
  location?: string | null;
  error?: string;
};

export type ComparisonReport = {
  generatedAt: string;
  oldInventory: RouteInventory;
  newInventory: RouteInventory;
  oldSourcePaths: string[];
  oldKnownPaths: string[];
  newCanonicalPaths: string[];
  tbdInSource: string[];
  sourceCoverage: {
    matchedCount: number;
    missingCount: number;
  };
  httpChecks?: {
    oldBaseUrl: string;
    newBaseUrl: string;
    oldResults: HttpCheckResult[];
    newResults: HttpCheckResult[];
    missingOnNew: string[];
  };
};
