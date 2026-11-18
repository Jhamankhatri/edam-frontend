import type { ApiEnvelope, ErrorBody, FieldErrorDetail } from './contracts';

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isOptionalString(value: unknown): boolean {
  return value === undefined || value === null || typeof value === 'string';
}

function isErrorBody(value: unknown): value is ErrorBody {
  return (
    isRecord(value) &&
    typeof value.code === 'string' &&
    typeof value.message === 'string'
  );
}

function isFieldErrorDetail(value: unknown): value is FieldErrorDetail {
  return (
    isRecord(value) &&
    typeof value.field === 'string' &&
    typeof value.message === 'string'
  );
}

/**
 * Validates the transport envelope at the network boundary. The generic `data`
 * payload remains `unknown` until a generated OpenAPI schema is available.
 */
function isApiEnvelope(value: unknown): value is ApiEnvelope<unknown> {
  if (!isRecord(value) || typeof value.success !== 'boolean') return false;
  if (value.error !== undefined && value.error !== null && !isErrorBody(value.error)) return false;
  if (value.fieldErrors !== undefined && value.fieldErrors !== null) {
    if (!Array.isArray(value.fieldErrors) || !value.fieldErrors.every(isFieldErrorDetail)) {
      return false;
    }
  }
  return (
    isOptionalString(value.correlationId) &&
    isOptionalString(value.path) &&
    isOptionalString(value.timestamp)
  );
}

export async function parseApiEnvelope(
  response: Response,
): Promise<ApiEnvelope<unknown> | undefined> {
  const clone = response.clone();
  const text = await clone.text();
  if (!text) return undefined;

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return undefined;
  }
  return isApiEnvelope(parsed) ? parsed : undefined;
}
