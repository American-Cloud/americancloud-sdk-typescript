# American Cloud TypeScript SDK

Typed TypeScript / JavaScript client for the [American Cloud](https://americancloud.com) public API.

This SDK is auto-generated from the OpenAPI specification using [Fern](https://buildwithfern.com). It targets American Cloud API **`v1`** — see [`VERSIONING.md`](./VERSIONING.md) for how SDK releases track the API.

## Installation

```sh
npm install @americancloud/sdk
# or
pnpm add @americancloud/sdk
```

## Authentication

Every request requires **both** parts of an American Cloud API key, sent as headers:

| Header | SDK option |
|---|---|
| `X-API-Client-ID` | `apiKey` |
| `X-API-Client-Secret` | `apiClientSecret` |

Create and manage keys at **[console.americancloud.com/api-keys](https://console.americancloud.com/api-keys)**. The client secret is shown once at creation — store it securely. If lost, revoke the key and create a new one.

Each key is scoped at creation:

- **`read-only`** — `GET` endpoints only
- **`read-write`** — full access to all resource management endpoints

## Quick start

```ts
import { AmericancloudApiClient } from "americancloud-sdk-typescript";

const client = new AmericancloudApiClient({
  apiKey: process.env.AMERICANCLOUD_API_CLIENT_ID!,
  apiClientSecret: process.env.AMERICANCLOUD_API_CLIENT_SECRET!,
});

const vms = await client.vms.listVms();
console.log(vms);
```

The client is namespaced by resource — `client.vms`, `client.blockStorage`, `client.kubernetes`, `client.dnsZones`, etc. Each namespace exposes the operations available on that resource.

## API endpoint

The SDK targets the American Cloud production API at **`https://api.americancloud.com`** by default. To override (e.g. for a self-hosted or internal environment), pass `baseUrl`:

```ts
const client = new AmericancloudApiClient({
  apiKey: "...",
  apiClientSecret: "...",
  baseUrl: "https://your-custom-endpoint.example.com",
});
```

## API reference

- **Full reference + code samples**: [americancloud.docs.buildwithfern.com](https://americancloud.docs.buildwithfern.com)
- **Interactive Swagger UI**: [api.americancloud.com/api-v1](https://api.americancloud.com/api-v1)

## Versioning

The SDK version **matches the API platform version it was generated from** — SDK `x.y.z` is generated from OpenAPI document `x.y.z`, so the SDK↔API mapping is one-to-one by construction:

- **Patch / minor** releases are backward-compatible — safe to upgrade.
- **Major** releases track a new API URL version (`/api/v2`) and may require code changes; check the [`CHANGELOG`](./CHANGELOG.md) first.
- The `1.x` line targets API `v1`, which remains available for at least six months after a `v2` release.
- Additive API changes (new endpoints, optional fields, enum values) ship within a version — tolerate unknown fields and new enum values gracefully.

See [`VERSIONING.md`](./VERSIONING.md) for the full policy.

## Reporting issues

Open an issue against this repository, or contact American Cloud support.

## Contributing

This SDK is generated — do not edit the source by hand. See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the generation workflow.
