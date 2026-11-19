# PR #4 visual comparison — before / after

- **`before/`** — screenshots committed with the first PR #4 design-system pass
  (commit `c7a0cbb324d83e03723bd6e4139edd56adf654e0`). The reviewed "generic
  SaaS admin template" visual state for login, bootstrap and dashboard.
- **`../screenshots/`** — refined "Institutional Register" screenshots from
  this pass, at desktop 1440, laptop 1280, tablet 834, tablet-small 768,
  mobile 390 and mobile-small 320.
- **`../screenshots/visual-audit.json`** — machine-readable audit and pixel diff.

All refined screenshots carry a harness-injected `DEVELOPMENT PREVIEW` banner.
Identity, organization, approval and notification values are synthetic values
injected through intercepted API envelopes; no live backend is used. See
`../../DESIGN_SYSTEM.md` §10 for the full provenance table.

## Changed-pixel ratios vs PR #4 baseline

Computed by `scripts/visual-audit.mjs --compare` (per-channel delta > 24,
common image area). Large ratios are expected: the composition, palette,
typography, surfaces and empty-state treatment were re-art-directed, not
tweaked.

| Viewport | login | bootstrap | dashboard |
| --- | --- | --- | --- |
| desktop 1440×900 | 88.1% | 87.5% | 80.7% |
| laptop 1280×800 | 83.6% | 86.6% | 81.1% |
| tablet 834×1112 | 70.4% | 71.0% | 75.4% |
| tablet-small 768×1024 | 72.2% | 71.8% | 74.0% |
| mobile 390×844 | 77.1% | 76.5% | 73.4% |
| mobile-small 320×720 | 79.6% | 79.2% | 74.5% |

This is a visual-difference check, not a full visual-regression service. The
small `DEVELOPMENT PREVIEW` banner and the synthetic preview identity are part
of the after captures by design.
