/**
 * Contract regression tests against the genuine, checksum-verified backend
 * OpenAPI snapshot. These tests do not start Spring Boot or PostgreSQL and make
 * no network calls: the snapshot is a pinned artifact from backend Actions run
 * 44395699755 (backend commit 620f7a795cc67a16e905115131f561bbd986af85).
 *
 * They resolve the Category 2 evidence gaps recorded in
 * `docs/PHASE1_STEP1_CONTRACT_NOTES.md` §2 and §5 without changing the 19
 * finalized handover documents.
 */
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { paths } from './generated/schema';
import { CANONICAL_LOOKUP_ENDPOINTS } from './endpoints';
import {
  FORBIDDEN_STATUS,
  isPermissionDeniedCode,
  SOURCE_ERROR_STATUS_BY_CODE,
} from './error-status';

const SNAPSHOT_URL = resolve(
  process.cwd(),
  'openapi-spec/openapi-620f7a795cc67a16e905115131f561bbd986af85.json',
);
const EXPECTED_SHA256 = '9533c5a5a9ce3044b2543cabaa7db09952b26c9e8581e08baf9889c33df2843d';
const EXPECTED_BYTES = 229310;
const HTTP_METHODS = ['get', 'put', 'post', 'delete', 'patch', 'options', 'head', 'trace'];

interface OpenApiDocument {
  openapi: string;
  paths: Record<string, unknown>;
  components: Record<string, unknown>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isOpenApiDocument(value: unknown): value is OpenApiDocument {
  if (!isRecord(value)) return false;
  if (typeof value.openapi !== 'string') return false;
  if (!isRecord(value.paths) || !isRecord(value.components)) return false;
  return true;
}

function record(value: unknown): Record<string, unknown> | undefined {
  return isRecord(value) ? value : undefined;
}

function parseDocument(raw: string): OpenApiDocument {
  const parsed: unknown = JSON.parse(raw);
  if (!isOpenApiDocument(parsed)) throw new Error('Pinned OpenAPI snapshot is not a valid document');
  return parsed;
}

function operationAt(
  doc: OpenApiDocument,
  path: string,
  method: string,
): Record<string, unknown> | undefined {
  return record(record(doc.paths[path])?.[method]);
}

function allOperations(doc: OpenApiDocument): Record<string, unknown>[] {
  const operations: Record<string, unknown>[] = [];
  for (const pathItem of Object.values(doc.paths)) {
    const item = record(pathItem);
    if (!item) continue;
    for (const method of HTTP_METHODS) {
      const operation = record(item[method]);
      if (operation) operations.push(operation);
    }
  }
  return operations;
}

/**
 * Compile-time proof that every canonical lookup path is present in the
 * openapi-typescript-generated `paths` interface. A missing path makes this
 * exported type fail `tsc --noEmit`; no `any` or `as` assertion is used.
 */
type CanonicalLookupSpecPath =
  `/api/v1${(typeof CANONICAL_LOOKUP_ENDPOINTS)[keyof typeof CANONICAL_LOOKUP_ENDPOINTS]}`;
type AssertGeneratedPaths<T extends keyof paths> = T;
export type VerifiedGeneratedLookupPaths = AssertGeneratedPaths<CanonicalLookupSpecPath>;

const raw = await readFile(SNAPSHOT_URL, 'utf8');
const doc = parseDocument(raw);
const specPaths = Object.keys(doc.paths);

describe('pinned OpenAPI artifact', () => {
  it('is byte-exact, checksum-verified, and generated from the real backend API', async () => {
    const bytes = await readFile(SNAPSHOT_URL);
    expect(bytes.length).toBe(EXPECTED_BYTES);
    expect(createHash('sha256').update(bytes).digest('hex')).toBe(EXPECTED_SHA256);
    expect(doc.openapi).toBe('3.1.0');
    expect(specPaths).toHaveLength(164);
    expect(allOperations(doc)).toHaveLength(208);
    expect(Object.keys(record(doc.components.schemas) ?? {})).toHaveLength(299);
    expect(record(doc.components.securitySchemes) ?? {}).toEqual({});
  });

  it('declares real request bodies, parameters and typed success responses', () => {
    const operations = allOperations(doc);
    const withRequestBody = operations.filter((operation) => operation.requestBody !== undefined);
    const parameterCount = operations.reduce((total, operation) => {
      const parameters = operation.parameters;
      return total + (Array.isArray(parameters) ? parameters.length : 0);
    }, 0);
    expect(withRequestBody).toHaveLength(79);
    expect(parameterCount).toBe(233);

    const login = operationAt(doc, '/api/v1/auth/login', 'post');
    const loginResponse = record(record(record(login?.responses)?.['200'])?.content);
    const loginSchema = record(record(loginResponse?.['application/json'])?.schema);
    expect(loginSchema?.$ref).toBe('#/components/schemas/ApiResponseCurrentUserResponse');

    const currentUser = record(record(doc.components.schemas)?.CurrentUserResponse);
    const loginRequest = record(record(doc.components.schemas)?.LoginRequest);
    expect(currentUser?.required).toBeUndefined();
    expect(loginRequest?.required).toEqual(['password', 'username']);
    // The spec carries no `nullable` metadata, so generated response fields are
    // optional and non-nullable; Step 1's cross-cutting contracts remain separate.
    expect(JSON.stringify(doc.components.schemas)).not.toContain('"nullable"');
  });

  it('declares only HTTP 200, so error statuses must come from backend source', () => {
    const codes = new Set<string>();
    for (const operation of allOperations(doc)) {
      for (const code of Object.keys(record(operation.responses) ?? {})) codes.add(code);
    }
    expect([...codes]).toEqual(['200']);
  });
});

describe('Category 2A — H02 HTTP status mapping', () => {
  it('records the source-derived statuses, not the stale H02 §3 table', () => {
    expect(SOURCE_ERROR_STATUS_BY_CODE['EDAM-3001']).toEqual([422]);
    expect(SOURCE_ERROR_STATUS_BY_CODE['EDAM-3004']).toEqual([422]);
    expect(SOURCE_ERROR_STATUS_BY_CODE['EDAM-5003']).toEqual([502]);
    expect(SOURCE_ERROR_STATUS_BY_CODE['EDAM-5001']).toEqual([409, 503]);
    // EDAM-5005 is in statusFor's BAD_REQUEST branch: H02's 400 is correct and
    // the previous audit note about a "missing branch" was wrong.
    expect(SOURCE_ERROR_STATUS_BY_CODE['EDAM-5005']).toEqual([400]);
  });

  it('classifies only the four source-derived 403 codes as permission denials', () => {
    expect(FORBIDDEN_STATUS).toBe(403);
    for (const code of ['EDAM-2002', 'EDAM-2005', 'EDAM-2003', 'EDAM-2004']) {
      expect(isPermissionDeniedCode(code)).toBe(true);
    }
    for (const code of ['EDAM-1001', 'EDAM-3001', 'EDAM-5005', undefined, null]) {
      expect(isPermissionDeniedCode(code)).toBe(false);
    }
  });
});

describe('Category 2B — H10 lookup endpoints', () => {
  it('defines exactly the ten canonical lookup paths', () => {
    expect(Object.values(CANONICAL_LOOKUP_ENDPOINTS)).toEqual([
      '/expense-configuration/request-types',
      '/expense-configuration/categories',
      '/expense-configuration/natures',
      '/workflows',
      '/master-data/currencies',
      '/master-data/vendors',
      '/master-data/tax-authorities',
      '/organization/departments',
      '/organization/units/tree',
      '/organization/branches',
    ]);
    expect(Object.keys(CANONICAL_LOOKUP_ENDPOINTS)).toHaveLength(10);
  });

  it('contains every canonical lookup path with a GET operation', () => {
    const relativePaths = Object.values(CANONICAL_LOOKUP_ENDPOINTS);
    expect(relativePaths).toHaveLength(10);
    for (const relative of relativePaths) {
      const path = `/api/v1${relative}`;
      expect(specPaths).toContain(path);
      expect(operationAt(doc, path, 'get')).toBeDefined();
    }
  });

  it('does not contain any H10-documented lookup path', () => {
    const h10Paths = [
      '/api/v1/configuration/request-types',
      '/api/v1/configuration/expense-categories',
      '/api/v1/configuration/expense-natures',
      '/api/v1/configuration/workflows/active',
      '/api/v1/organization/departments/tree',
    ];
    for (const path of h10Paths) expect(specPaths).not.toContain(path);
  });

  it('uses the real query parameters and response types for lookups', () => {
    const currencies = operationAt(doc, '/api/v1/master-data/currencies', 'get');
    const currencyParams = (Array.isArray(currencies?.parameters) ? currencies.parameters : [])
      .filter(isRecord)
      .map((parameter) => parameter.name);
    expect(currencyParams).toEqual(['includeInactive']); // H10 says `active=true`

    const vendors = operationAt(doc, '/api/v1/master-data/vendors', 'get');
    const vendorParams = (Array.isArray(vendors?.parameters) ? vendors.parameters : [])
      .filter(isRecord)
      .map((parameter) => parameter.name);
    expect(vendorParams).toContain('page');

    const taxAuthorities = operationAt(doc, '/api/v1/master-data/tax-authorities', 'get');
    expect(
      (Array.isArray(taxAuthorities?.parameters) ? taxAuthorities.parameters : [])
        .filter(isRecord)
        .map((parameter) => parameter.name),
    ).toEqual([]); // H10 says `page=...`; the spec returns a plain list

    const workflows = operationAt(doc, '/api/v1/workflows', 'get');
    const workflowParams = (Array.isArray(workflows?.parameters) ? workflows.parameters : [])
      .filter(isRecord)
      .map((parameter) => parameter.name);
    expect(workflowParams).toEqual(['includeInactive']); // no `/workflows/active` lookup
  });
});
