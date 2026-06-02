# Versioning & stability

**The SDK version matches the API platform version it was generated from.**
SDK `x.y.z` — in every language — is generated from version `x.y.z` of the
American Cloud OpenAPI document. There is no separate mapping table to consult:
if you want to know which API surface an SDK release covers, the version number
*is* the answer.

| | What it is | Where you see it |
|---|---|---|
| **API URL version** | The wire contract: `/api/v1/...` | The request path |
| **Platform / SDK version** | A specific revision of the API surface, and the SDK generated from it | `info.version` in the OpenAPI doc, and the SDK package version (npm / PyPI / Go tag) |

## The API URL version (`/api/v1`)

This is the breaking-change boundary:

- **Breaking changes** — removing an endpoint or field, changing a field's
  type, or making a previously-optional parameter required — only ship under a
  **new URL version** (`/api/v2`). They never land silently in `/api/v1`.
- **Additive changes** — new endpoints, new optional fields, new enum values —
  may ship at any time *within* a version. Write code that tolerates unknown
  fields and unrecognized enum values gracefully.
- When a new major version is released, the **previous version remains
  available for at least six months**.

## The SDK / platform version (this package)

Semantic versioning, shared across the platform and all SDK languages:

- **Patch** (`1.2.1` → `1.2.2`) — fixes, documentation, SDK-internal or
  packaging changes. No code changes required.
- **Minor** (`1.2.x` → `1.3.0`) — additive, backward-compatible API changes:
  new endpoints, new optional parameters, new response fields, new enum
  values. Safe to upgrade.
- **Major** (`1.x` → `2.0.0`) — tracks a new API URL version (`/api/v2`).
  Read the CHANGELOG before upgrading.

All SDK languages (TypeScript, Go, Python) release together at each platform
version. A language may occasionally skip a number (e.g. a fix that only
affects one SDK) — version gaps are normal.

### Which API version does my SDK target?

> The **`1.x`** line of every SDK targets American Cloud API **`v1`**.

When API `v2` ships, SDKs move to `2.x` alongside it, and `1.x` keeps working
against `v1` for at least the six-month window above.

## How to know when you must upgrade

- **You never *have* to upgrade within a major line.** A pinned `1.x` version
  keeps working as long as API `v1` is live.
- **Upgrade to get new features** — install the latest minor/patch.
- **Plan an upgrade when a new major ships** — that's the only release that
  can require code changes, and the CHANGELOG documents exactly what changed.

We recommend pinning a version and upgrading deliberately, rather than
tracking the latest automatically.

## Package identifiers

| Language | Package | Install |
|---|---|---|
| TypeScript | `@americancloud/sdk` (npm) | `npm install @americancloud/sdk` |
| Python | `americancloud` (PyPI) | `pip install americancloud` |
| Go | `github.com/American-Cloud/americancloud-sdk-go` | `go get github.com/American-Cloud/americancloud-sdk-go` |

## Changelog

Per-release changes are recorded in [`CHANGELOG.md`](./CHANGELOG.md).
