import { apiFetch } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type {
  BranchResponse,
  CancelRequestPayload,
  CategoryResponse,
  CreateRequestPayload,
  CurrencyResponse,
  DashboardQuery,
  DashboardSummary,
  DepartmentResponse,
  LookupResponse,
  PageResponseRequestSummary,
  RequestListQuery,
  RequestResponse,
  RequestTimelineQuery,
  TaxAuthorityResponse,
  TimelinePage,
  UpdateRequestPayload,
} from './request-contracts';

export type QueryPrimitive = string | number | boolean | undefined;

function toQuery(params: Record<string, QueryPrimitive>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === '') continue;
    search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : '';
}

function requestPath(id: string): string {
  return `${ENDPOINTS.requests}/${encodeURIComponent(id)}`;
}

export function listRequests(query: RequestListQuery = {}): Promise<PageResponseRequestSummary> {
  return apiFetch<PageResponseRequestSummary>({
    method: 'GET',
    path: `${ENDPOINTS.requests}${toQuery({ ...query })}`,
  });
}

export function getRequest(id: string): Promise<RequestResponse> {
  return apiFetch<RequestResponse>({ method: 'GET', path: requestPath(id) });
}

export function getRequestTimeline(
  id: string,
  query: Omit<RequestTimelineQuery, 'cursor'> & { cursor?: string } = {},
): Promise<TimelinePage> {
  return apiFetch<TimelinePage>({
    method: 'GET',
    path: `${requestPath(id)}/activity${toQuery({ ...query })}`,
  });
}

export function createRequest(
  payload: CreateRequestPayload,
  idempotencyKey?: string,
): Promise<RequestResponse> {
  return apiFetch<RequestResponse>({
    method: 'POST',
    path: ENDPOINTS.requests,
    body: payload,
    idempotencyKey,
  });
}

export function updateRequest(
  id: string,
  payload: UpdateRequestPayload,
  idempotencyKey?: string,
): Promise<RequestResponse> {
  return apiFetch<RequestResponse>({
    method: 'PUT',
    path: requestPath(id),
    body: payload,
    idempotencyKey,
  });
}

export function submitRequest(id: string, idempotencyKey?: string): Promise<RequestResponse> {
  return apiFetch<RequestResponse>({
    method: 'POST',
    path: `${requestPath(id)}/submit`,
    idempotencyKey,
  });
}

export function cancelRequest(
  id: string,
  payload: CancelRequestPayload,
  idempotencyKey?: string,
): Promise<RequestResponse> {
  return apiFetch<RequestResponse>({
    method: 'POST',
    path: `${requestPath(id)}/cancel`,
    body: payload,
    idempotencyKey,
  });
}

export function getDashboardSummary(query: DashboardQuery = {}): Promise<DashboardSummary> {
  return apiFetch<DashboardSummary>({
    method: 'GET',
    path: `${ENDPOINTS.reportingDashboard}${toQuery({ ...query })}`,
  });
}

export function getRequestTypes(): Promise<LookupResponse[]> {
  return apiFetch<LookupResponse[]>({ method: 'GET', path: ENDPOINTS.requestTypes });
}

export function getExpenseCategories(): Promise<CategoryResponse[]> {
  return apiFetch<CategoryResponse[]>({
    method: 'GET',
    path: `${ENDPOINTS.expenseCategories}${toQuery({ includeInactive: false })}`,
  });
}

export function getExpenseNatures(): Promise<LookupResponse[]> {
  return apiFetch<LookupResponse[]>({ method: 'GET', path: ENDPOINTS.expenseNatures });
}

export function getDepartments(): Promise<DepartmentResponse[]> {
  return apiFetch<DepartmentResponse[]>({ method: 'GET', path: ENDPOINTS.departments });
}

export function getBranches(): Promise<BranchResponse[]> {
  return apiFetch<BranchResponse[]>({ method: 'GET', path: ENDPOINTS.branches });
}

export function getCurrencies(): Promise<CurrencyResponse[]> {
  return apiFetch<CurrencyResponse[]>({
    method: 'GET',
    path: `${ENDPOINTS.currencies}${toQuery({ includeInactive: false })}`,
  });
}

export function getTaxAuthorities(): Promise<TaxAuthorityResponse[]> {
  return apiFetch<TaxAuthorityResponse[]>({ method: 'GET', path: ENDPOINTS.taxAuthorities });
}
