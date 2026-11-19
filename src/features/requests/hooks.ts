import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/auth/useAuth';
import { queryKeys } from '@/app/query-client';
import type { QueryPrimitive } from '@/api/services/requests';
import {
  cancelRequest,
  createRequest,
  getBranches,
  getCurrencies,
  getDepartments,
  getExpenseCategories,
  getExpenseNatures,
  getRequest,
  getRequestTimeline,
  getRequestTypes,
  getTaxAuthorities,
  listRequests,
  submitRequest,
  updateRequest,
} from '@/api/services/requests';
import type {
  BranchResponse,
  CancelRequestPayload,
  CategoryResponse,
  CreateRequestPayload,
  CurrencyResponse,
  DepartmentResponse,
  LookupResponse,
  RequestListQuery,
  TaxAuthorityResponse,
  TimelinePage,
  UpdateRequestPayload,
} from '@/api/services/request-contracts';

export interface RequestLookups {
  requestTypes: LookupResponse[];
  categories: CategoryResponse[];
  natures: LookupResponse[];
  departments: DepartmentResponse[];
  branches: BranchResponse[];
  currencies: CurrencyResponse[];
  taxAuthorities: TaxAuthorityResponse[];
}

export interface RequestLookupState {
  data: RequestLookups;
  unavailable: readonly string[];
  errors: readonly Error[];
  isLoading: boolean;
  refetchAll: () => Promise<void>;
}

/**
 * Reference-data queries are permission-aware UX controls. The backend still
 * enforces every lookup permission; a missing code produces an explicit
 * unavailable state instead of a guessed option list.
 */
export function useRequestLookups(): RequestLookupState {
  const { hasPermission } = useAuth();
  const canReadExpenseConfiguration = hasPermission('expense-configuration:view');
  const canReadOrganization = hasPermission('organization:view');
  const canReadCurrency = hasPermission('currency:view');

  const requestTypes = useQuery({
    queryKey: queryKeys.requests.lookups.requestTypes,
    queryFn: getRequestTypes,
    enabled: canReadExpenseConfiguration,
  });
  const categories = useQuery({
    queryKey: queryKeys.requests.lookups.categories,
    queryFn: getExpenseCategories,
    enabled: canReadExpenseConfiguration,
  });
  const natures = useQuery({
    queryKey: queryKeys.requests.lookups.natures,
    queryFn: getExpenseNatures,
    enabled: canReadExpenseConfiguration,
  });
  const departments = useQuery({
    queryKey: queryKeys.requests.lookups.departments,
    queryFn: getDepartments,
    enabled: canReadOrganization,
  });
  const branches = useQuery({
    queryKey: queryKeys.requests.lookups.branches,
    queryFn: getBranches,
    enabled: canReadOrganization,
  });
  const currencies = useQuery({
    queryKey: queryKeys.requests.lookups.currencies,
    queryFn: getCurrencies,
    enabled: canReadCurrency,
  });
  const taxAuthorities = useQuery({
    queryKey: queryKeys.requests.lookups.taxAuthorities,
    queryFn: getTaxAuthorities,
    enabled: canReadCurrency,
  });

  const queries = [
    requestTypes, categories, natures, departments, branches, currencies, taxAuthorities,
  ] as const;
  const unavailable: string[] = [];
  if (!canReadExpenseConfiguration) unavailable.push('Request types, categories and natures');
  if (!canReadOrganization) unavailable.push('Departments and branches');
  if (!canReadCurrency) unavailable.push('Currencies and tax authorities');
  const errors = queries
    .map((query) => query.error)
    .filter((error): error is Error => error instanceof Error);

  const refetchAll = async (): Promise<void> => {
    const tasks: Promise<unknown>[] = [];
    if (canReadExpenseConfiguration) {
      tasks.push(requestTypes.refetch(), categories.refetch(), natures.refetch());
    }
    if (canReadOrganization) tasks.push(departments.refetch(), branches.refetch());
    if (canReadCurrency) tasks.push(currencies.refetch(), taxAuthorities.refetch());
    await Promise.all(tasks);
  };

  return {
    data: {
      requestTypes: requestTypes.data ?? [],
      categories: categories.data ?? [],
      natures: natures.data ?? [],
      departments: departments.data ?? [],
      branches: branches.data ?? [],
      currencies: currencies.data ?? [],
      taxAuthorities: taxAuthorities.data ?? [],
    },
    unavailable,
    errors,
    isLoading:
      (canReadExpenseConfiguration &&
        (requestTypes.isLoading || categories.isLoading || natures.isLoading)) ||
      (canReadOrganization && (departments.isLoading || branches.isLoading)) ||
      (canReadCurrency && (currencies.isLoading || taxAuthorities.isLoading)),
    refetchAll,
  };
}

export interface RequestFilterLookups {
  categories: CategoryResponse[];
  departments: DepartmentResponse[];
  currencies: CurrencyResponse[];
  unavailable: readonly string[];
  errors: readonly Error[];
  isLoading: boolean;
  refetchAll: () => Promise<void>;
}

/** Only the three reference sets needed to label documented list filters/rows. */
export function useRequestFilterLookups(): RequestFilterLookups {
  const { hasPermission } = useAuth();
  const canReadExpenseConfiguration = hasPermission('expense-configuration:view');
  const canReadOrganization = hasPermission('organization:view');
  const canReadCurrency = hasPermission('currency:view');
  const categories = useQuery({
    queryKey: queryKeys.requests.lookups.categories,
    queryFn: getExpenseCategories,
    enabled: canReadExpenseConfiguration,
  });
  const departments = useQuery({
    queryKey: queryKeys.requests.lookups.departments,
    queryFn: getDepartments,
    enabled: canReadOrganization,
  });
  const currencies = useQuery({
    queryKey: queryKeys.requests.lookups.currencies,
    queryFn: getCurrencies,
    enabled: canReadCurrency,
  });
  const unavailable: string[] = [];
  if (!canReadExpenseConfiguration) unavailable.push('Categories');
  if (!canReadOrganization) unavailable.push('Departments');
  if (!canReadCurrency) unavailable.push('Currencies');
  const errors = [categories.error, departments.error, currencies.error]
    .filter((error): error is Error => error instanceof Error);
  const refetchAll = async (): Promise<void> => {
    const tasks: Promise<unknown>[] = [];
    if (canReadExpenseConfiguration) tasks.push(categories.refetch());
    if (canReadOrganization) tasks.push(departments.refetch());
    if (canReadCurrency) tasks.push(currencies.refetch());
    await Promise.all(tasks);
  };
  return {
    categories: categories.data ?? [],
    departments: departments.data ?? [],
    currencies: currencies.data ?? [],
    unavailable,
    errors,
    isLoading:
      (canReadExpenseConfiguration && categories.isLoading) ||
      (canReadOrganization && departments.isLoading) ||
      (canReadCurrency && currencies.isLoading),
    refetchAll,
  };
}

export function useRequestList(params: RequestListQuery) {
  const keyParams: Record<string, QueryPrimitive> = { ...params };
  return useQuery({
    queryKey: queryKeys.requests.list(keyParams),
    queryFn: () => listRequests(params),
    placeholderData: keepPreviousData,
  });
}

export function useRequestDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.requests.detail(id),
    queryFn: () => getRequest(id),
    enabled: Boolean(id),
  });
}

const ACTIVITY_PAGE_SIZE = 20;
const initialCursor: string | undefined = undefined;

export function useRequestActivity(id: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.requests.activity(id, ACTIVITY_PAGE_SIZE),
    queryFn: ({ pageParam }) => getRequestTimeline(id, { size: ACTIVITY_PAGE_SIZE, cursor: pageParam }),
    initialPageParam: initialCursor,
    getNextPageParam: (lastPage: TimelinePage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    enabled: Boolean(id),
  });
}

function useInvalidateRequestViews() {
  const queryClient = useQueryClient();
  return async (): Promise<void> => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all }),
    ]);
  };
}

export function useCreateRequest() {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateRequestViews();
  return useMutation({
    mutationFn: ({ payload, idempotencyKey }: { payload: CreateRequestPayload; idempotencyKey: string }) =>
      createRequest(payload, idempotencyKey),
    onSuccess: async (response) => {
      if (response.id) queryClient.setQueryData(queryKeys.requests.detail(response.id), response);
      await invalidate();
    },
  });
}

export function useUpdateRequest() {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateRequestViews();
  return useMutation({
    mutationFn: ({ id, payload, idempotencyKey }: {
      id: string;
      payload: UpdateRequestPayload;
      idempotencyKey: string;
    }) => updateRequest(id, payload, idempotencyKey),
    onSuccess: async (response, variables) => {
      queryClient.setQueryData(queryKeys.requests.detail(variables.id), response);
      await invalidate();
    },
  });
}

export function useSubmitRequest() {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateRequestViews();
  return useMutation({
    mutationFn: ({ id, idempotencyKey }: { id: string; idempotencyKey: string }) =>
      submitRequest(id, idempotencyKey),
    onSuccess: async (response, variables) => {
      queryClient.setQueryData(queryKeys.requests.detail(variables.id), response);
      await invalidate();
    },
  });
}

export function useCancelRequest() {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateRequestViews();
  return useMutation({
    mutationFn: ({ id, payload, idempotencyKey }: {
      id: string;
      payload: CancelRequestPayload;
      idempotencyKey: string;
    }) => cancelRequest(id, payload, idempotencyKey),
    onSuccess: async (response, variables) => {
      queryClient.setQueryData(queryKeys.requests.detail(variables.id), response);
      await invalidate();
    },
  });
}
