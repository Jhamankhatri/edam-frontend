import type { components, operations } from '@/api/generated/schema';

/** Generated DTO aliases used by Step 2 services, hooks, validation and views. */
export type CreateRequestPayload = components['schemas']['CreateRequest'];
export type UpdateRequestPayload = components['schemas']['UpdateRequest'];
export type CancelRequestPayload = components['schemas']['CancelRequest'];
export type RequestResponse = components['schemas']['RequestResponse'];
export type RequestSummary = components['schemas']['RequestSummary'];
export type PageResponseRequestSummary = components['schemas']['PageResponseRequestSummary'];
export type DashboardQuery = NonNullable<operations['dashboard']['parameters']['query']>;
export type DashboardSummary = components['schemas']['DashboardSummary'];
export type MetricCard = components['schemas']['MetricCard'];
export type DistributionRow = components['schemas']['DistributionRow'];
export type TrendPoint = components['schemas']['TrendPoint'];
export type RequestListQuery = NonNullable<operations['list_5']['parameters']['query']>;
export type RequestTimelineQuery = NonNullable<operations['timeline']['parameters']['query']>;
export type TimelinePage = components['schemas']['TimelinePage'];
export type TimelineEntry = components['schemas']['TimelineEntry'];
export type LookupResponse = components['schemas']['LookupResponse'];
export type CategoryResponse = components['schemas']['CategoryResponse'];
export type SubcategoryResponse = components['schemas']['SubcategoryResponse'];
export type CurrencyResponse = components['schemas']['CurrencyResponse'];
export type TaxAuthorityResponse = components['schemas']['TaxAuthorityResponse'];
export type DepartmentResponse = components['schemas']['DepartmentResponse'];
export type BranchResponse = components['schemas']['BranchResponse'];
export type RequestStatus = NonNullable<RequestListQuery['status']>;

/** Exact enum from generated `list_5` / `dashboard` query parameters. */
export const REQUEST_STATUS_VALUES: readonly RequestStatus[] = [
  'DRAFT',
  'SUBMITTED',
  'IN_PROGRESS',
  'RETURNED',
  'APPROVED',
  'REJECTED',
  'CANCELLED',
  'REVERSED',
] as const;
