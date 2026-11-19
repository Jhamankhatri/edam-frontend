/**
 * Step 2 contract checks against the checksum-verified backend OpenAPI snapshot.
 * These are offline contract assertions; they do not start Spring Boot,
 * PostgreSQL or a browser, and they do not modify the pinned artifact.
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  ENDPOINTS,
  IDEMPOTENT_ROUTES,
  isIdempotentEndpoint,
} from './endpoints';
import { REQUEST_STATUS_VALUES } from './services/request-contracts';
import type {
  CreateRequestPayload,
  DashboardSummary,
  RequestResponse,
  UpdateRequestPayload,
} from './services/request-contracts';
import type { components, paths } from './generated/schema';

const SNAPSHOT_URL = resolve(
  process.cwd(),
  'openapi-spec/openapi-620f7a795cc67a16e905115131f561bbd986af85.json',
);

interface OpenApiDocument {
  paths: Record<string, unknown>;
  components: Record<string, unknown>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function record(value: unknown): Record<string, unknown> | undefined {
  return isRecord(value) ? value : undefined;
}

const parsed: unknown = JSON.parse(await readFile(SNAPSHOT_URL, 'utf8'));
if (!isRecord(parsed) || !isRecord(parsed.paths) || !isRecord(parsed.components)) {
  throw new Error('Pinned OpenAPI snapshot is not a valid document');
}
const doc = parsed as unknown as OpenApiDocument;

function operationAt(path: string, method: string): Record<string, unknown> {
  const operation = record(record(doc.paths[path])?.[method]);
  if (!operation) throw new Error(`Missing ${method.toUpperCase()} ${path}`);
  return operation;
}

function parameterNames(operation: Record<string, unknown>): string[] {
  return (Array.isArray(operation.parameters) ? operation.parameters : [])
    .filter(isRecord)
    .map((parameter) => String(parameter.name));
}

function schemaProperties(name: string): string[] {
  return Object.keys(record(record(record(doc.components.schemas)?.[name])?.properties) ?? {});
}

function requiredProperties(name: string): string[] {
  const schemas = record(doc.components.schemas) ?? {};
  const required = record(schemas[name])?.required;
  return Array.isArray(required) ? required.map(String) : [];
}

function requestBodyRef(operation: Record<string, unknown>): string | undefined {
  const schema = record(
    record(record(record(operation.requestBody)?.content)?.['application/json'])?.schema,
  );
  return typeof schema?.$ref === 'string' ? schema.$ref : undefined;
}

type Assert<T extends true> = T;
type CreateHasDepartment = Assert<'departmentId' extends keyof CreateRequestPayload ? true : false>;
type UpdateHasNoDepartment = Assert<'departmentId' extends keyof UpdateRequestPayload ? false : true>;
type UpdateHasNoDocuments = Assert<'documents' extends keyof UpdateRequestPayload ? false : true>;
type ResponseHasFlags = Assert<
  'canEdit' extends keyof RequestResponse
    ? 'canSubmit' extends keyof RequestResponse
      ? 'canCancel' extends keyof RequestResponse
        ? true
        : false
      : false
    : false
>;
type DashboardHasDistributions = Assert<
  'byStatus' extends keyof DashboardSummary
    ? 'byDepartment' extends keyof DashboardSummary
      ? 'byCategory' extends keyof DashboardSummary
        ? 'byExpenseType' extends keyof DashboardSummary
          ? 'trend' extends keyof DashboardSummary
            ? true
            : false
          : false
        : false
      : false
    : false
>;
type GeneratedStep2Paths = Assert<
  '/api/v1/expense-requests' extends keyof paths
    ? '/api/v1/reporting/dashboard' extends keyof paths
      ? true
      : false
    : false
>;
export type VerifiedStep2Types = [
  CreateHasDepartment,
  UpdateHasNoDepartment,
  UpdateHasNoDocuments,
  ResponseHasFlags,
  DashboardHasDistributions,
  GeneratedStep2Paths,
  Assert<components['schemas']['RequestResponse'] extends RequestResponse ? true : false>,
];

describe('Step 2 OpenAPI operations', () => {
  it('pins the exact documented request, activity and dashboard endpoints', () => {
    expect(ENDPOINTS.requests).toBe('/expense-requests');
    expect(ENDPOINTS.reportingDashboard).toBe('/reporting/dashboard');
    expect(ENDPOINTS.requestTypes).toBe('/expense-configuration/request-types');
    expect(ENDPOINTS.expenseCategories).toBe('/expense-configuration/categories');
    expect(ENDPOINTS.expenseNatures).toBe('/expense-configuration/natures');
    expect(ENDPOINTS.currencies).toBe('/master-data/currencies');
    expect(ENDPOINTS.taxAuthorities).toBe('/master-data/tax-authorities');
    expect(ENDPOINTS.departments).toBe('/organization/departments');
    expect(ENDPOINTS.branches).toBe('/organization/branches');

    const operations: readonly [path: string, method: string, operationId: string][] = [
      ['/api/v1/expense-requests', 'get', 'list_5'],
      ['/api/v1/expense-requests', 'post', 'create_5'],
      ['/api/v1/expense-requests/{id}', 'get', 'get_3'],
      ['/api/v1/expense-requests/{id}', 'put', 'update_5'],
      ['/api/v1/expense-requests/{id}/submit', 'post', 'submit'],
      ['/api/v1/expense-requests/{id}/cancel', 'post', 'cancel'],
      ['/api/v1/expense-requests/{id}/activity', 'get', 'timeline'],
      ['/api/v1/reporting/dashboard', 'get', 'dashboard'],
      ['/api/v1/reporting/expense-requests/register', 'get', 'register'],
    ];
    for (const [path, method, operationId] of operations) {
      expect(operationAt(path, method).operationId).toBe(operationId);
    }
  });

  it('uses the documented list, timeline, dashboard and write DTO query shapes', () => {
    expect(parameterNames(operationAt('/api/v1/expense-requests', 'get'))).toEqual([
      'search', 'status', 'departmentId', 'categoryId', 'mineOnly', 'page', 'size', 'sort',
    ]);
    expect(parameterNames(operationAt('/api/v1/expense-requests/{id}/activity', 'get')))
      .toEqual(['id', 'size', 'cursor']);
    expect(parameterNames(operationAt('/api/v1/reporting/dashboard', 'get'))).toEqual([
      'departmentId', 'branchId', 'categoryId', 'subcategoryId', 'requesterId',
      'expenseType', 'currency', 'status', 'from', 'to', 'search', 'lookbackDays',
    ]);
    expect(requestBodyRef(operationAt('/api/v1/expense-requests', 'post')))
      .toBe('#/components/schemas/CreateRequest');
    expect(requestBodyRef(operationAt('/api/v1/expense-requests/{id}', 'put')))
      .toBe('#/components/schemas/UpdateRequest');
    expect(requestBodyRef(operationAt('/api/v1/expense-requests/{id}/cancel', 'post')))
      .toBe('#/components/schemas/CancelRequest');
    expect(requestBodyRef(operationAt('/api/v1/expense-requests/{id}/submit', 'post')))
      .toBeUndefined();
  });

  it('keeps the status enum, DTO omissions and server action flags explicit', () => {
    const statusParameter = (operationAt('/api/v1/expense-requests', 'get').parameters as unknown[])
      .filter(isRecord)
      .find((parameter) => parameter.name === 'status');
    expect(record(statusParameter?.schema)?.enum).toEqual(REQUEST_STATUS_VALUES);

    expect([...requiredProperties('CreateRequest')].sort()).toEqual([
      'currencyId', 'departmentId', 'expenseCategoryId', 'expenseNatureId',
      'requestTypeId', 'requestedAmount',
    ]);
    expect([...requiredProperties('UpdateRequest')].sort()).toEqual([
      'currencyId', 'expenseCategoryId', 'expenseNatureId',
      'requestTypeId', 'requestedAmount',
    ]);
    expect(schemaProperties('UpdateRequest')).not.toContain('departmentId');
    expect(schemaProperties('UpdateRequest')).not.toContain('documents');
    expect(schemaProperties('UpdateRequest')).not.toContain('version');
    expect(schemaProperties('RequestResponse')).toEqual(expect.arrayContaining([
      'canEdit', 'canSubmit', 'canCancel', 'terminal', 'version',
    ]));

    const responseFields = schemaProperties('OpexDetailResponse');
    const payloadFields = schemaProperties('OpexDetailPayload');
    for (const field of ['threeQuotationsSelected', 'alreadyApproved', 'taxExempt', 'grnRequired']) {
      expect(payloadFields).toContain(field);
      expect(responseFields).not.toContain(field);
    }
    const capexResponseFields = schemaProperties('CapexDetailResponse');
    const capexPayloadFields = schemaProperties('CapexDetailPayload');
    for (const field of ['purchaseNature', 'financeComment', 'budgetComment', 'termsAndConditions']) {
      expect(capexPayloadFields).toContain(field);
      expect(capexResponseFields).not.toContain(field);
    }
  });

  it('keeps `sort` transport-only and the idempotency route list source-exact', () => {
    const sortParameter = (operationAt('/api/v1/expense-requests', 'get').parameters as unknown[])
      .filter(isRecord)
      .find((parameter) => parameter.name === 'sort');
    expect(record(sortParameter?.schema)?.type).toBe('string');
    expect(record(sortParameter?.schema)?.array).toBeUndefined();

    expect(IDEMPOTENT_ROUTES).toHaveLength(8);
    for (const [method, path] of [
      ['POST', '/expense-requests'],
      ['PUT', '/expense-requests/request-1'],
      ['POST', '/expense-requests/request-1/submit'],
      ['POST', '/expense-requests/request-1/cancel'],
    ] as const) {
      expect(isIdempotentEndpoint(method, path)).toBe(true);
    }
    expect(isIdempotentEndpoint('POST', ENDPOINTS.authLogin)).toBe(false);
  });
});
