# American Cloud TypeScript SDK

Typed TypeScript / JavaScript client for the [American Cloud](https://americancloud.com) public API.

This SDK is auto-generated from the OpenAPI specification using [Fern](https://buildwithfern.com). It targets American Cloud API **`v1`** — see [`VERSIONING.md`](./VERSIONING.md) for how SDK releases track the API.

![Listing regions and VMs with the American Cloud TypeScript SDK](https://raw.githubusercontent.com/American-Cloud/americancloud-sdk-typescript/master/.demo/sdk-firstcall.gif)

## Installation

```sh
npm install @americancloud/sdk
# or
pnpm add @americancloud/sdk
```

## Authentication

Every request carries an American Cloud **API token** in the `Authorization: Bearer` header. Create one at **[console.americancloud.com/api-tokens](https://console.americancloud.com/api-tokens)**. The token is shown once at creation — store it securely. If lost, revoke it and create a new one.

Pass the token as `token`, or set `AMERICANCLOUD_API_TOKEN` and omit it. A token has the permissions you chose when you created it: start with the **Read-only** preset, or choose **Full access** to create, change and delete resources. `client.whoami.getWhoami()` returns the permissions the token has now.

## Quick start

```ts
import { AmericancloudApiClient } from "@americancloud/sdk";

const client = new AmericancloudApiClient({
  token: process.env.AMERICANCLOUD_API_TOKEN!,
});

const vms = await client.vms.listVms();
console.log(vms);
```

The client is namespaced by resource — `client.vms`, `client.blockStorage`, `client.kubernetes`, `client.dnsZones`, etc. Each namespace exposes the operations available on that resource.

## API endpoint

The SDK targets the American Cloud production API at **`https://api.americancloud.com`** by default. To override (e.g. for a self-hosted or internal environment), pass `baseUrl`:

```ts
const client = new AmericancloudApiClient({
  token: "...",
  baseUrl: "https://your-custom-endpoint.example.com",
});
```

## API reference

- **Full reference + code samples**: [americancloud.com/docs/api](https://americancloud.com/docs/api)
- **Interactive Swagger UI**: [api.americancloud.com/api-v1](https://api.americancloud.com/api-v1)

## Guides

Narrative walkthroughs on the American Cloud docs site:

- [TypeScript SDK quickstart](https://americancloud.com/docs/sdks/typescript) — install, authenticate, estimate cost, then create a VM, with error handling and pagination
- [SDKs & Terraform overview](https://americancloud.com/docs/sdks/overview) — when to reach for an SDK, Terraform, or the MCP server
- [Deploy with AI](https://americancloud.com/docs/deploy-with-ai/overview) — let an AI assistant build and ship to American Cloud

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
