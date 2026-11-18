# H11 — File & Document Integration

Documents are managed **per expense request** (DOC-002 `GET /documents/requests/{requestId}`).
There is NO standalone `/app/documents` register in Phase 1 — the per-request Documents tab is
the only UI.

## Operations

| Op | Endpoint | Body | Perm |
|----|----------|------|------|
| Upload | DOC-001 POST `/documents` | `multipart/form-data` with fields `file`, `expenseRequestId`, `category`, `description?` | `document:upload` |
| List | DOC-002 GET `/documents/requests/{requestId}` | — | `document:download` |
| Get metadata | DOC-003 GET `/documents/{id}` | — | `document:download` |
| Delete | DOC-004 DELETE `/documents/{id}` | — | `document:delete` |
| Download URL | DOC-005 GET `/documents/{id}/download-url` | — | `document:download` (returns `{url, expiresInSeconds:300}`) |
| Malware-scan events | DOC-006 GET `/documents/{id}/scans` | Pageable | `document:download` |

## Upload flow
1. `POST /documents` with multipart; browser must set `Content-Type` (no manual override).
2. Response → `DocumentResponse` with `scanStatus=PENDING`.
3. Poll DOC-003 every 2 s (cap 30 s, backoff 2x) until `scanStatus ∈ {CLEAN, INFECTED}`.
4. INFECTED → show error row; do NOT offer download.
5. CLEAN → available for download.

## Download
1. GET DOC-005 → `{url}` (signed URL, 5-min TTL).
2. Open URL in a new tab (`window.open(url, '_blank', 'noopener')`) for Phase 1 (D-21).
3. **NO inline PDF/image preview in Phase 1.** Inline preview is deferred until deployed
   storage/CDN URLs and CSP are verified.
