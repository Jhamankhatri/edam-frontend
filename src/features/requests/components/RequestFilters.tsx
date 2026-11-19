import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { FormField } from '@/components/forms/FormField';
import { Input } from '@/components/ui/input';
import { SelectField } from '@/components/ui/select';
import { Surface } from '@/components/ui/surface';
import { SectionLabel } from '@/components/ui/register';
import { REQUEST_STATUS_VALUES } from '@/api/services/request-contracts';
import { ALL_OPTION } from '../form-config';
import { ALL_FILTER, type RequestListFilters, type SelectOption } from '../types';
import { formatStatus } from '../format';
import type { RequestFilterLookups } from '../hooks';

interface RequestFiltersProps {
  filters: RequestListFilters;
  lookups: RequestFilterLookups;
  onChange: (next: Partial<RequestListFilters>) => void;
}

const STATUS_OPTIONS: readonly SelectOption[] = [
  ALL_OPTION,
  ...REQUEST_STATUS_VALUES.map((status) => ({ value: status, label: formatStatus(status) })),
] as const;

const SIZE_OPTIONS: readonly SelectOption[] = [
  { value: '20', label: '20 rows' },
  { value: '50', label: '50 rows' },
  { value: '100', label: '100 rows' },
] as const;

function withCurrentSize(options: readonly SelectOption[], size: number): SelectOption[] {
  return options.some((option) => option.value === String(size))
    ? [...options]
    : [{ value: String(size), label: `${size} rows` }, ...options];
}

export function RequestFilters({ filters, lookups, onChange }: RequestFiltersProps) {
  const [searchDraft, setSearchDraft] = useState(filters.search ?? '');
  useEffect(() => {
    setSearchDraft(filters.search ?? '');
  }, [filters.search]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchDraft !== (filters.search ?? '')) {
        onChange({ search: searchDraft.trim() || undefined, page: 0 });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchDraft, filters.search, onChange]);

  const categoryOptions: SelectOption[] = [
    ALL_OPTION,
    ...lookups.categories
      .filter((category) => category.id && category.active !== false)
      .map((category) => ({ value: category.id ?? '', label: category.name ?? category.code ?? category.id ?? '' })),
  ];
  const departmentOptions: SelectOption[] = [
    ALL_OPTION,
    ...lookups.departments
      .filter((department) => department.id && department.active !== false)
      .map((department) => ({ value: department.id ?? '', label: department.name ?? department.code ?? department.id ?? '' })),
  ];

  return (
    <Surface variant="flat" padding="md" className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionLabel index="01">Register controls</SectionLabel>
        <Badge variant="outline">Server order: newest created first</Badge>
      </div>
      {lookups.unavailable.length > 0 && (
        <Alert variant="info">
          <AlertDescription>
            Some reference selectors are unavailable for this session: {lookups.unavailable.join('; ')}.
            Text filters and backend-enforced list results remain available.
          </AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <FormField id="request-search" label="Search">
          <Input
            id="request-search"
            type="search"
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
            placeholder="Request number or text"
          />
        </FormField>
        <FormField id="request-status" label="Status">
          <SelectField
            id="request-status"
            value={filters.status ?? ALL_FILTER}
            options={STATUS_OPTIONS}
            onValueChange={(value) => onChange({ status: value === ALL_FILTER ? undefined : value as RequestListFilters['status'], page: 0 })}
          />
        </FormField>
        <FormField id="request-page-size" label="Rows per page">
          <SelectField
            id="request-page-size"
            value={String(filters.size)}
            options={withCurrentSize(SIZE_OPTIONS, filters.size)}
            onValueChange={(value) => onChange({ size: Number(value), page: 0 })}
          />
        </FormField>
        {categoryOptions.length > 1 && (
          <FormField id="request-category" label="Category">
            <SelectField
              id="request-category"
              value={filters.categoryId ?? ALL_FILTER}
              options={categoryOptions}
              onValueChange={(value) => onChange({ categoryId: value === ALL_FILTER ? undefined : value, page: 0 })}
            />
          </FormField>
        )}
        {departmentOptions.length > 1 && (
          <FormField id="request-department" label="Department">
            <SelectField
              id="request-department"
              value={filters.departmentId ?? ALL_FILTER}
              options={departmentOptions}
              onValueChange={(value) => onChange({ departmentId: value === ALL_FILTER ? undefined : value, page: 0 })}
            />
          </FormField>
        )}
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        The pinned OpenAPI declares `sort`, but the backend fixes this register to `createdAt` descending.
        No client sort control is offered. Filter values use only documented query parameters.
      </p>
    </Surface>
  );
}
