# H11 — File & Document Integration

EDAM's document subsystem supports uploading attachments (quotations, invoices, receipts)
against an expense request, running asynchronous malware scans, and issuing time-limited
signed download URLs. Source: `com.edam.documents.controller.DocumentController`.

## 1. Endpoints (DOC-*)

| ID | Method | Path | Perm | Purpose |
|----|--------|------|------|---------|
| DOC-001 | POST | `/api/v1/documents` | `document:upload` | Upload a document (multipart form; ties directly to an expense request) |
| DOC-002 | GET | `/api/v1/documents/requests/{requestId}` | `document:download` (also covers list/view) | List documents attached to a request |
| DOC-003 | GET | `/api/v1/documents/{id}` | `document:download` | Metadata for one document |
| DOC-004 | GET | `/api/v1/documents/{id}/download-url` | `document:download` | Issue a signed, time-limited download URL (5 min) |
| DOC-005 | GET | `/api/v1/documents/{id}/scans` | `document:download` | Malware-scan event history |
| DOC-006 | DELETE | `/api/v1/documents/{id}` | `document:delete` | Soft-delete a document |

There is no separate "associate" endpoint — upload binds directly to `expenseRequestId` passed
as a form field.

## 2. Upload contract

`POST /api/v1/documents` is `multipart/form-data`, not JSON. Form fields:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `file` | binary (multipart file part) | yes | Max size and allowed types configured server-side (`application.yml`); `INVALID_DOCUMENT` returned on violation |
| `expenseRequestId` | UUID (string) | yes | Target request |
| `category` | string | yes | Logical category (e.g. `quotation`, `invoice`, `receipt`, `supporting`) — catalogue driven; use lookups from expense-config |
| `description` | string | no | Free-text note |

Upload flow:
1. User drags file into dropzone or uses file picker.
2. Client validates file extension & client-side size cap (e.g. 25 MB) before upload.
3. POST the multipart request (requires CSRF header; no Idempotency-Key needed because each
   upload creates a new document id — retries produce duplicate documents, so warn on retry).
4. Server responds 201 with `DocumentResponse` containing `id`, `filename`, `size`, `contentType`,
   `category`, `description`, `uploadedAt`, `scanStatus` (initially `PENDING`).
5. Append the new document row to the local list in "scanning" state; poll DOC-003 every 2 s
   (capped at 30 s) until `scanStatus ∈ {CLEAN, INFECTED}`.
6. If `CLEAN` → show document with download action enabled. If `INFECTED` → show red "File
   rejected by malware scan" state; disable download; offer delete. If still `PENDING` after
   30 s → show "Scan taking longer than expected; we'll notify you" and rely on the
   notification inbox to deliver the final result.

## 3. Download contract

The API never streams raw file bytes directly. Instead, DOC-004 returns a **signed URL**:

```json
{ "url": "https://…/…signed…", "expiresInSeconds": 300 }
```

Frontend flow:
1. User clicks "Download" → call DOC-004.
2. Open the URL in a new tab / create an `<a download>` and click it. The URL is short-lived;
   don't cache it.
3. For preview (PDF/image), set the URL into an `<iframe>` or `<img>`; open download in a new
   tab for other types.
4. If the URL returns 403/404 (expired or revoked), refresh by calling DOC-004 again.

This approach keeps the `JSESSIONID` cookie out of cross-origin/CDN paths and lets the
backend stream from storage (S3/filesystem) without buffering.

## 4. DocumentResponse fields (from introspection)

From `docs/phase-4j/_generated/dtos.json` (`DocumentResponse` in `DocumentDtos.java`):

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | |
| `filename` | string | Original client filename |
| `size` | long | bytes (format with `filesize` utility) |
| `contentType` | string | MIME type from upload |
| `category` | string | Upload category |
| `description` | string | null |
| `expenseRequestId` | UUID | |
| `uploadedBy` | UUID (actor) | |
| `uploadedByName` | string | |
| `uploadedAt` | Instant | |
| `scanStatus` | `"PENDING" \| "CLEAN" \| "INFECTED"` | See §5 |

## 5. Malware-scan states

| State | Meaning | UI |
|-------|---------|----|
| `PENDING` | Scan queued / in progress | Spinner + "Scanning for malware…"; download disabled |
| `CLEAN` | Passed | Normal state; download enabled |
| `INFECTED` | Rejected | Error state; download disabled; delete allowed; audit entry recorded |

Scan history (DOC-005) returns a list of `ScanEventResponse` records with timestamp, scanner,
verdict, and detail — useful for audit views.

## 6. UI components needed

- `<FileDropzone>`: drag/drop + click-to-browse, with per-file progress, client validation,
  multi-file support, list of queued uploads.
- `<DocumentList>`: used both inside request detail (Documents tab) and on `/app/documents`;
  columns: filename, type icon, category, size, uploaded by, uploaded at, status, actions.
- `<DocumentPreview>`: modal dialog showing PDF/image preview using the signed URL; falls back
  to download for other types.
- `<ScanStatusBadge>`: small badge showing scan status with appropriate colour.

## 7. Constraints & edge cases

- Client-side file-type whitelist must be a **subset** of server-side allowed types; always
  trust server rejection (`INVALID_DOCUMENT`) over client checks.
- Do not upload into DRAFT requests unless the backend permits it (verify against codegen —
  upload currently requires the request to exist, which it does from draft creation onward).
- Soft-deleted documents are hidden from list endpoints; a 404 on metadata/download indicates
  the document was deleted or the user lost access.
- CSRF token required for POST/DELETE (multipart POSTs carry the `X-XSRF-TOKEN` header like
  any other write).
- Upload progress: use `fetch` with `onUploadProgress` via `axios` or a streamed fetch, or fall
  back to an indeterminate spinner (TanStack Query doesn't ship progress out of the box — use
  a small `useUploadProgress` hook over XHR for Phase 1).
