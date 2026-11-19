import { Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/forms/FormField';
import { Input } from '@/components/ui/input';
import { SelectField } from '@/components/ui/select';
import { Surface } from '@/components/ui/surface';
import { Textarea } from '@/components/ui/textarea';
import { SectionLabel } from '@/components/ui/register';
import { CAPEX_FIELDS, NONE_OPTION, OPEX_FIELDS, SECTION_CONFIGS } from '../form-config';
import { detailFieldKey, sectionFieldKey } from '../validation';
import type {
  DetailKind,
  FieldErrors,
  RowField,
  RowValues,
  SectionKey,
  SelectOption,
} from '../types';
import { NO_SELECTION } from '../types';
import type { OptionSets } from '../form-state';

interface OptionProps {
  id: string;
  label: string;
  value: string;
  options: readonly SelectOption[];
  onValueChange: (value: string) => void;
  error?: string;
  hint?: string;
  optional?: boolean;
}

export function FormGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>;
}

export function LookupSelect({
  id, label, value, options, onValueChange, error, hint, optional,
}: OptionProps) {
  const resolved = optional ? [NONE_OPTION, ...options] : options;
  return (
    <FormField id={id} label={label} error={error} hint={hint}>
      {resolved.length > 0 ? (
        <SelectField
          id={id}
          value={value || undefined}
          options={resolved}
          onValueChange={onValueChange}
          placeholder="Select a reference value"
        />
      ) : (
        <p className="rounded-lg border border-line bg-surface-subtle px-3.5 py-3 text-sm text-muted-foreground">
          No active options were returned by the backend.
        </p>
      )}
    </FormField>
  );
}

export function TextControl({
  id,
  label,
  value,
  onValueChange,
  error,
  hint,
  type = 'text',
  maxLength,
  multiline = false,
}: {
  id: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
  hint?: string;
  type?: 'text' | 'number' | 'date';
  maxLength?: number;
  multiline?: boolean;
}) {
  return (
    <FormField id={id} label={label} error={error} hint={hint}>
      {multiline ? (
        <Textarea
          id={id}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          maxLength={maxLength}
          invalid={Boolean(error)}
        />
      ) : (
        <Input
          id={id}
          type={type}
          inputMode={type === 'number' ? 'decimal' : undefined}
          step={type === 'number' ? 'any' : undefined}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          maxLength={maxLength}
          invalid={Boolean(error)}
        />
      )}
    </FormField>
  );
}

function resolvedOptions(field: RowField, optionSets: OptionSets): readonly SelectOption[] {
  if (field.options) return field.options;
  if (!field.optionsKey) return [];
  const options = optionSets[field.optionsKey];
  return field.defaultValue === NO_SELECTION ? [NONE_OPTION, ...options] : options;
}

function FieldControl({
  field,
  row,
  id,
  error,
  optionSets,
  onChange,
}: {
  field: RowField;
  row: RowValues;
  id: string;
  error?: string;
  optionSets: OptionSets;
  onChange: (value: string) => void;
}) {
  const value = row[field.name] ?? '';
  if (field.type === 'select') {
    const options = resolvedOptions(field, optionSets);
    return (
      <FormField id={id} label={field.label} error={error}>
        {options.length > 0 ? (
          <SelectField
            id={id}
            value={value || undefined}
            options={options}
            onValueChange={onChange}
            placeholder="Select a reference value"
          />
        ) : (
          <p className="rounded-lg border border-line bg-surface-subtle px-3.5 py-3 text-sm text-muted-foreground">
            No active options were returned by the backend.
          </p>
        )}
      </FormField>
    );
  }
  return (
    <TextControl
      id={id}
      label={field.label}
      value={value}
      onValueChange={onChange}
      error={error}
      type={field.type === 'textarea' ? 'text' : field.type}
      maxLength={field.maxLength}
      multiline={field.type === 'textarea'}
    />
  );
}

interface SectionProps {
  errors: FieldErrors;
  optionSets: OptionSets;
  state: {
    allocations: RowValues[];
    items: RowValues[];
    quotations: RowValues[];
    invoices: RowValues[];
    previousSummaries: RowValues[];
    staDetails: RowValues[];
    budgetSummaries: RowValues[];
  };
  onChange: (section: SectionKey, index: number, field: string, value: string) => void;
  onAdd: (section: SectionKey) => void;
  onRemove: (section: SectionKey, index: number) => void;
}

export function RepeatableSections({ errors, optionSets, state, onChange, onAdd, onRemove }: SectionProps) {
  return (
    <div className="space-y-8">
      {SECTION_CONFIGS.map((section) => (
        <section key={section.key} aria-labelledby={`${section.key}-heading`} className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionLabel index={section.index}>
                <span id={`${section.key}-heading`}>{section.title}</span>
              </SectionLabel>
              <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground">
                {section.description}
              </p>
            </div>
            <Button type="button" variant="outline" onClick={() => onAdd(section.key)}>
              Add row
            </Button>
          </div>
          {state[section.key].length === 0 ? (
            <p className="border-b border-line-soft py-4 text-sm text-muted-foreground">
              No rows supplied. Optional sections are omitted from the request payload.
            </p>
          ) : (
            <div className="space-y-4">
              {state[section.key].map((row, index) => (
                <Surface key={`${section.key}-${index}`} variant="inset" padding="sm" className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-numeric text-xs font-semibold uppercase tracking-micro text-accent-warm">
                      {section.index}.{String(index + 1).padStart(2, '0')}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove ${section.title} row ${index + 1}`}
                      onClick={() => onRemove(section.key, index)}
                    >
                      <Trash2 aria-hidden="true" className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormGrid>
                    {section.fields.map((field) => {
                      const id = `${section.key}-${index}-${field.name}`;
                      const key = sectionFieldKey(section.key, index, field.name);
                      return (
                        <FieldControl
                          key={field.name}
                          field={field}
                          row={row}
                          id={id}
                          error={errors[key]}
                          optionSets={optionSets}
                          onChange={(value) => onChange(section.key, index, field.name, value)}
                        />
                      );
                    })}
                  </FormGrid>
                </Surface>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}

export function TypedDetailSection({
  detailKind,
  opex,
  capex,
  errors,
  optionSets,
  onChange,
}: {
  detailKind: DetailKind;
  opex: RowValues;
  capex: RowValues;
  errors: FieldErrors;
  optionSets: OptionSets;
  onChange: (detail: 'opex' | 'capex', field: string, value: string) => void;
}) {
  if (detailKind === NO_SELECTION) {
    return (
      <section aria-labelledby="typed-detail-heading" className="space-y-3">
        <SectionLabel index="03">
          <span id="typed-detail-heading">Typed details</span>
        </SectionLabel>
        <p className="text-sm leading-relaxed text-muted-foreground">
          No typed detail block will be sent. The backend resolves classification from the configured
          request type and category; this form does not choose a classification rule.
        </p>
      </section>
    );
  }
  const detail = detailKind === 'OPEX' ? 'opex' : 'capex';
  const fields = detailKind === 'OPEX' ? OPEX_FIELDS : CAPEX_FIELDS;
  const row = detailKind === 'OPEX' ? opex : capex;
  return (
    <section aria-labelledby="typed-detail-heading" className="space-y-4">
      <SectionLabel index="03">
        <span id="typed-detail-heading">{detailKind === 'OPEX' ? 'OPEX details' : 'CAPEX details'}</span>
      </SectionLabel>
      <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground">
        Exactly one typed detail block is sent. The backend validates the category, request type and
        all conditional submission rules.
      </p>
      <FormGrid>
        {fields.map((field) => {
          const id = `${detail}-${field.name}`;
          const key = detailFieldKey(detail, field.name);
          return (
            <FieldControl
              key={field.name}
              field={field}
              row={row}
              id={id}
              error={errors[key]}
              optionSets={optionSets}
              onChange={(value) => onChange(detail, field.name, value)}
            />
          );
        })}
      </FormGrid>
    </section>
  );
}
